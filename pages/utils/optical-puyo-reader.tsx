'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import UtilsLayout from '@/components/layout/UtilsLayout';
import { useI18n } from '@/lib/i18n/i18nContext';

type ColorCategory = 'R' | 'G' | 'B' | 'Y' | 'P' | 'O' | '';

export default function Component() {
  const { t } = useI18n();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [colorGrid, setColorGrid] = useState<string[][]>([]);
  const [categoryGrid, setCategoryGrid] = useState<ColorCategory[][]>([]);
  const [threshold, setThreshold] = useState(51);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => setImageUrl(e.target?.result as string);
          reader.readAsDataURL(file);
          event.preventDefault();
          break;
        }
      }
    }
  };

  const categorizeColor = useCallback((color: string): ColorCategory => {
    const rgb = color.match(/\d+/g)?.map(Number);
    if (!rgb) return 'O';
    const [r, g, b] = rgb;
    
    const emptyTargetR = 50, emptyTargetG = 72, emptyTargetB = 35;
    const emptyThreshold = 20;
    
    if (
      Math.abs(r - emptyTargetR) <= emptyThreshold &&
      Math.abs(g - emptyTargetG) <= emptyThreshold &&
      Math.abs(b - emptyTargetB) <= emptyThreshold
    ) {
      return '';
    }

    const otherTargetR = 50, otherTargetG = 80, otherTargetB = 71;
    const otherThreshold = 10;

    if (
      Math.abs(r - otherTargetR) <= otherThreshold &&
      Math.abs(g - otherTargetG) <= otherThreshold &&
      Math.abs(b - otherTargetB) <= otherThreshold
    ) {
      return 'O';
    }

    if (
      Math.abs(r - 162) <= threshold &&
      Math.abs(g - 92) <= threshold &&
      Math.abs(b - 91) <= threshold
    ) {
      return 'R';
    }

    if (
      Math.abs(r - 84) <= threshold &&
      Math.abs(g - 125) <= threshold &&
      Math.abs(b - 155) <= threshold
    ) {
      return 'B';
    }

    if (
      Math.abs(r - 195) <= threshold &&
      Math.abs(g - 179) <= threshold &&
      Math.abs(b - 114) <= threshold
    ) {
      return 'Y';
    }

    if (
      Math.abs(r - 137) <= threshold &&
      Math.abs(g - 89) <= threshold &&
      Math.abs(b - 151) <= threshold
    ) {
      return 'P';
    }

    if (g > r && g > b) return 'G';

    return 'O';
  }, [threshold]);

  const analyzeImage = useCallback(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
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
    if (imageUrl) {
      img.src = imageUrl;
    }
  }, [imageUrl, categorizeColor]);

  useEffect(() => {
    if (typeof window !== 'undefined' && imageUrl && canvasRef.current) {
      analyzeImage();
    }
  }, [imageUrl, analyzeImage]);

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
    <UtilsLayout onPaste={handlePaste}>
      <h1 className="text-2xl font-bold mb-4">{t('common.tools.opticalPuyoReader.title')}</h1>
      <Input 
        type="file" 
        accept="image/png" 
        onChange={handleImageUpload} 
        className="mb-4" 
        aria-label={t('common.tools.opticalPuyoReader.uploadPngImageAriaLabel')}
      />
      <p>{t('common.tools.opticalPuyoReader.uploadTip')}</p>
      {imageUrl && (
        <div className="mb-4">
          <Image src={imageUrl} alt={t('common.tools.opticalPuyoReader.uploadedImageAlt')} width={imageDimensions.width} height={imageDimensions.height} className="max-w-full h-auto" />
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />
      {colorGrid.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-2">{t('common.tools.opticalPuyoReader.originalColors')}</h2>
          <div className="overflow-x-auto mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 6 }, (_, i) => (
                    <TableHead key={i} className="text-center">{t('common.tools.opticalPuyoReader.column')} {i + 1}</TableHead>
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
                        aria-label={`${t('common.tools.opticalPuyoReader.row')} ${rowIndex + 1}, ${t('common.tools.opticalPuyoReader.column')} ${colIndex + 1}: ${column[rowIndex]}`}
                      ></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
 
          <h2 className="text-xl font-bold mb-2">{t('common.tools.opticalPuyoReader.categorizedColors')}</h2>
          <div className="overflow-x-auto mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: 6 }, (_, i) => (
                    <TableHead key={i} className="text-center">{t('common.tools.opticalPuyoReader.column')} {i + 1}</TableHead>
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
                        aria-label={`${t('common.tools.opticalPuyoReader.row')} ${rowIndex + 1}, ${t('common.tools.opticalPuyoReader.column')} ${colIndex + 1}: ${column[rowIndex] || t('common.tools.opticalPuyoReader.empty')}`}
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
              {t('common.tools.opticalPuyoReader.colorSnapSensitivity')}: {threshold}
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
            <h2 className="text-xl font-bold mb-2">{t('common.tools.opticalPuyoReader.chainSimulatorLink')}</h2>
            <a 
              href={generateChainSimLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {t('common.tools.opticalPuyoReader.openInChainSimulator')}
            </a>
          </div>
        </>
      )}
    </UtilsLayout>
  );
}
