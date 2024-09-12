'use client'

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"

type ColorCategory = 'R' | 'G' | 'B' | 'Y' | 'P' | 'O' | '';

export default function Component() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [colorGrid, setColorGrid] = useState<string[][]>([]);
  const [categoryGrid, setCategoryGrid] = useState<ColorCategory[][]>([]);
  const [threshold, setThreshold] = useState(51);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && imageUrl && canvasRef.current) {
      analyzeImage();
    }
  }, [imageUrl, threshold]);

  const analyzeImage = () => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const cellWidth = img.width / 6;
        const cellHeight = img.height / 12;
        const newColorGrid: string[][] = [];
        const newCategoryGrid: ColorCategory[][] = [];

        for (let x = 0; x < 6; x++) {
          const column: string[] = [];
          const categoryColumn: ColorCategory[] = [];
          for (let y = 0; y < 12; y++) {
            const imageData = ctx.getImageData(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
            const color = getAverageColor(imageData.data);
            column.push(color);
            categoryColumn.push(categorizeColor(color));
          }
          newColorGrid.push(column);
          newCategoryGrid.push(categoryColumn);
        }

        setColorGrid(newColorGrid);
        setCategoryGrid(newCategoryGrid);
      }
    };
    img.src = imageUrl!;
  };

  const getAverageColor = (data: Uint8ClampedArray): string => {
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    const count = data.length / 4;
    return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
  };

  const categorizeColor = (color: string): ColorCategory => {
    const rgb = color.match(/\d+/g)?.map(Number);
    if (!rgb) return 'O';
    const [r, g, b] = rgb;
    
    // Check if the color is close to rgb(50, 72, 35)
    const emptyTargetR = 50, emptyTargetG = 72, emptyTargetB = 35;
    const emptyThreshold = 20;
    
    if (
      Math.abs(r - emptyTargetR) <= emptyThreshold &&
      Math.abs(g - emptyTargetG) <= emptyThreshold &&
      Math.abs(b - emptyTargetB) <= emptyThreshold
    ) {
      return '';
    }

    // Check if the color is close to rgb(50, 80, 71)
    const otherTargetR = 50, otherTargetG = 80, otherTargetB = 71;
    const otherThreshold = 10;

    if (
      Math.abs(r - otherTargetR) <= otherThreshold &&
      Math.abs(g - otherTargetG) <= otherThreshold &&
      Math.abs(b - otherTargetB) <= otherThreshold
    ) {
      return 'O';
    }

    // Red: rgb(162, 92, 91)
    if (
      Math.abs(r - 162) <= threshold &&
      Math.abs(g - 92) <= threshold &&
      Math.abs(b - 91) <= threshold
    ) {
      return 'R';
    }

    // Blue: rgb(84, 125, 155)
    if (
      Math.abs(r - 84) <= threshold &&
      Math.abs(g - 125) <= threshold &&
      Math.abs(b - 155) <= threshold
    ) {
      return 'B';
    }

    // Yellow: rgb(195, 179, 114)
    if (
      Math.abs(r - 195) <= threshold &&
      Math.abs(g - 179) <= threshold &&
      Math.abs(b - 114) <= threshold
    ) {
      return 'Y';
    }

    // Purple: rgb(137, 89, 151)
    if (
      Math.abs(r - 137) <= threshold &&
      Math.abs(g - 89) <= threshold &&
      Math.abs(b - 151) <= threshold
    ) {
      return 'P';
    }

    // Green (keeping the previous logic as it wasn't specified in the new colors)
    if (g > r && g > b) return 'G';

    return 'O'; // Other
  };

  const getCategoryColor = (category: ColorCategory): string => {
    switch (category) {
      case 'R': return 'rgb(162, 92, 91)';
      case 'G': return 'rgb(0, 255, 0)'; // Keeping green as is since it wasn't specified
      case 'B': return 'rgb(84, 125, 155)';
      case 'Y': return 'rgb(195, 179, 114)';
      case 'P': return 'rgb(137, 89, 151)';
      case 'O': return 'rgb(128, 128, 128)';
      default: return 'transparent';
    }
  };

  const generateChainSimLink = () => {
    if (categoryGrid.length === 0) return '';

    const colorMap: { [key in ColorCategory]: number } = {
      'R': 4, 'G': 7, 'B': 5, 'Y': 6, 'P': 8, 'O': 0, '': 0
    };

    let chain = '';
    for (let y = 0; y <= 11; y++) {
      for (let x = 0; x < 6; x++) {
        chain += colorMap[categoryGrid[x][y]];
      }
    }

    return `https://puyonexus.com/chainsim/?w=6&h=12&chain=${chain}`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Optical Puyo Reader</h1>
      <Input 
        type="file" 
        accept="image/png" 
        onChange={handleImageUpload} 
        className="mb-4" 
        aria-label="Upload PNG image"
      />
      {imageUrl && (
        <div className="mb-4">
          <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto" />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
      {colorGrid.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-2">Original Colors</h2>
          <div className="overflow-x-auto mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 6 }, (_, i) => (
                    <TableHead key={i} className="text-center">Column {i + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 12 }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {colorGrid.map((column, colIndex) => (
                      <TableCell 
                        key={colIndex} 
                        style={{ backgroundColor: column[rowIndex] }} 
                        className="w-16 h-8"
                        aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${column[rowIndex]}`}
                      ></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <h2 className="text-xl font-bold mb-2">Categorized Colors</h2>
          <div className="overflow-x-auto mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 6 }, (_, i) => (
                    <TableHead key={i} className="text-center">Column {i + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 12 }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {categoryGrid.map((column, colIndex) => (
                      <TableCell 
                        key={colIndex} 
                        style={{ 
                          backgroundColor: getCategoryColor(column[rowIndex]),
                          border: column[rowIndex] === '' ? '1px solid #ccc' : 'none'
                        }} 
                        className="w-16 h-8 text-center text-white font-bold"
                        aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${column[rowIndex] || 'Empty'}`}
                      >
                        {column[rowIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mb-4">
            <label htmlFor="threshold-slider" className="block text-sm font-medium text-gray-700 mb-1">
              Color Snap Sensitivity: {threshold}
            </label>
            <Slider
              id="threshold-slider"
              min={10}
              max={100}
              step={1}
              value={[threshold]}
              onValueChange={(value) => setThreshold(value[0])}
              className="w-full"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Chain Simulator Link</h2>
            <a 
              href={generateChainSimLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Open in Chain Simulator
            </a>
          </div>
        </>
      )}
    </div>
  );
}