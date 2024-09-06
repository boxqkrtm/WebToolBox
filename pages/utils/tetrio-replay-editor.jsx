'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronRight, ChevronDown, Plus, Minus } from 'lucide-react';

const JsonNode = ({ data, path, onUpdate, onDelete, onAdd, scrollToRef, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(JSON.stringify(data));
  const nodeRef = useRef(null);

  const handleToggle = () => setIsExpanded(!isExpanded);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(JSON.stringify(data));
  };

  const handleSave = () => {
    try {
      const newData = JSON.parse(editValue);
      onUpdate(path, newData);
      setIsEditing(false);
    } catch (error) {
      alert('Invalid JSON');
    }
  };

  const handleAddChild = () => {
    onAdd(path);
    if (nodeRef.current) {
      scrollToRef.current = nodeRef.current;
    }
  };

  if (isEditing) {
    return (
      <div className="ml-4 my-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleSave} className="mr-2">Save</Button>
        <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
      </div>
    );
  }

  if (typeof data !== 'object' || data === null) {
    return (
      <div className="ml-4 my-2 flex items-center">
        <span className="mr-2">{JSON.stringify(data)}</span>
        <Button onClick={handleEdit} size="sm" variant="outline" className="mr-2">Edit</Button>
        <Button onClick={() => onDelete(path)} size="sm" variant="outline"><Minus size={16} /></Button>
      </div>
    );
  }

  const isArray = Array.isArray(data);
  const isEmpty = Object.keys(data).length === 0;

  return (
    <div className={`ml-4 my-2 relative ${level > 0 ? 'border-l pl-4' : ''}`} ref={nodeRef}>
      <div className={`flex items-center bg-white ${level > 0 ? 'sticky z-10' : ''}`} style={{top: `${level * 40}px`}}>
        <Button onClick={handleToggle} variant="ghost" size="sm">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </Button>
        <span className="mr-2">{isArray ? '[]' : '{}'}</span>
        <Button onClick={handleAddChild} size="sm" variant="outline" className="mr-2"><Plus size={16} /></Button>
        <Button onClick={() => onDelete(path)} size="sm" variant="outline"><Minus size={16} /></Button>
      </div>
      {isExpanded && !isEmpty && (
        <div className="ml-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <span className="mr-2">{key}:</span>
              <JsonNode
                data={value}
                path={[...path, key]}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onAdd={onAdd}
                scrollToRef={scrollToRef}
                level={level + 1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function TetrioReplayEditor() {
  const [json, setJson] = useState({});
  const [error, setError] = useState('');
  const [filename, setFilename] = useState('');
  const scrollToRef = useRef(null);

  useEffect(() => {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
      scrollToRef.current = null;
    }
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (['ttrm', 'ttr', 'json'].includes(extension)) {
        setFilename(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = JSON.parse(e.target.result);
            setJson(content);
            setError('');
          } catch (err) {
            setError('Invalid JSON content in the file');
          }
        };
        reader.readAsText(file);
      } else {
        setError('Unsupported file type. Please upload a .ttrm, .ttr, or .json file.');
      }
    }
  };

  const handleUpdate = (path, value) => {
    const newJson = { ...json };
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setJson(newJson);
  };

  const handleDelete = (path) => {
    const newJson = { ...json };
    let current = newJson;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    if (Array.isArray(current)) {
      current.splice(path[path.length - 1], 1);
    } else {
      delete current[path[path.length - 1]];
    }
    setJson(newJson);
  };

  const handleAdd = (path) => {
    const newJson = { ...json };
    let current = newJson;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]];
    }
    if (Array.isArray(current)) {
      const lastElement = current[current.length - 1];
      const newElement = typeof lastElement === 'object' && lastElement !== null
        ? JSON.parse(JSON.stringify(lastElement))  // Deep clone for objects
        : lastElement;  // For primitives, just copy the value
      current.push(newElement);
    } else if (typeof current === 'object' && current !== null) {
      let newKey = '';
      let counter = 1;
      do {
        newKey = `newField${counter}`;
        counter++;
      } while (current.hasOwnProperty(newKey));
      current[newKey] = null;
    }
    setJson(newJson);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'data.ttrm';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>TETR.IO Replay Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <input
              type="file"
              accept=".ttrm,.ttr,.json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>
          <div className="border p-4 rounded-md max-h-[60vh] overflow-auto">
            <JsonNode
              data={json}
              path={[]}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAdd={onAdd}
              scrollToRef={scrollToRef}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleDownload}>Download Replay</Button>
        {filename && <span className="text-sm text-gray-500">Current file: {filename}</span>}
      </CardFooter>
    </Card>
  );
}
