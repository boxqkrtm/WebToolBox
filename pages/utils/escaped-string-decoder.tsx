import { useState } from "react";
import Head from "next/head";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Error from "next/error";

export default function EscapedStringDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convertText = () => {
    try {
      // Extract text between quotes if present
      const match = input.match(/:\s*"([^"]*)"/)
      const text = match ? match[1] : input;

      // Unescape the Unicode escape sequences and other special characters
      const unescaped = text
        .replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
          return String.fromCodePoint(parseInt(hex, 16));
        })
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/,,/g, ',');  // Handle double commas

      setOutput(unescaped);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Escaped String Decoder</title>
        <meta name="description" content="Convert escaped strings with double commas to readable text" />
      </Head>

      <main className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Escaped String Decoder</h1>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input">Escaped String</Label>
              <Textarea
                id="input"
                placeholder='Enter escaped text (e.g. "\uAD00")'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="font-mono"
              />
            </div>

            <Button onClick={convertText}>Convert</Button>

            <div className="space-y-2">
              <Label htmlFor="output">Converted Text</Label>
              <Textarea
                id="output"
                value={output}
                readOnly
                className="font-mono"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
