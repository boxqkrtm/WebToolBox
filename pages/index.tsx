import { useState } from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
import {
  HiCode,
  HiDatabase,
  HiPuzzle,
  HiVideoCamera,
  HiChatAlt2,
  HiLightningBolt,
  HiLocationMarker,
  HiCollection,
  HiArrowLeft,
} from 'react-icons/hi';
import { Button } from '@/components/ui/button';

export const categories = [
    { name: 'JSON', slug: 'json', icon: HiCode, description: 'Tools for working with JSON data.' },
    { name: 'SQL', slug: 'sql', icon: HiDatabase, description: 'Tools for database and SQL operations.' },
    { name: 'Game', slug: 'game', icon: HiPuzzle, description: 'Utilities for various games.' },
    { name: 'Video', slug: 'video', icon: HiVideoCamera, description: 'Tools for video and image manipulation.' },
    { name: 'Discord', slug: 'discord', icon: HiChatAlt2, description: 'Utilities for Discord.' },
    { name: 'LLM', slug: 'llm', icon: HiLightningBolt, description: 'Tools for Large Language Models.' },
    { name: 'Geolocation', slug: 'geolocation', icon: HiLocationMarker, description: 'Tools for working with geographic data.' },
    { name: 'Etc', slug: 'etc', icon: HiCollection, description: 'Other miscellaneous utilities.' },
];

export const pages = [
  { title: 'CSV Sorter', path: '/utils/csv-sorter', category: 'sql', description: 'Sort CSV files by various criteria.' },
  { title: 'XLSX to SQL', path: '/utils/xlsx-to-sql', category: 'sql', description: 'Convert XLSX files to SQL INSERT statements.' },
  { title: 'Tetrio.replay-editor', path: '/utils/tetrio-replay-editor', category: 'game', description: 'Edit Tetrio replay files.' },
  { title: 'OPR(Optical Puyo Reader)', path: '/utils/optical-puyo-reader', category: 'game', description: 'Read Puyo Puyo fields from images.' },
  { title: 'KakaoMap Coord Opener', path: '/utils/kakaomap-coord-opener', category: 'geolocation', description: 'Open coordinates in KakaoMap.' },
  { title: 'NTRIP Mount Point Scanner', path: '/utils/ntrip-scanner', category: 'geolocation', description: 'Scan for NTRIP mount points.' },
  { title: 'Discord Color Message Generator', path: '/utils/discord-color-message-generator', category: 'discord', description: 'Create colorful messages for Discord.' },
  { title: 'Escaped String Decoder', path: '/utils/escaped-string-decoder', category: 'json', description: 'Decode escaped strings.' },
  { title: 'LLM VRAM Calculator (GGUF)', path: '/utils/llm-vram-calculator', category: 'llm', description: 'Calculate VRAM requirements for GGUF models.' },
  { title: 'Image to Base64 Converter', path: '/utils/image-to-base64', category: 'video', description: 'Convert images to Base64 strings.' },
  { title: 'MP4 Trimmer', path: '/utils/mp4-trimmer', category: 'video', description: 'Trim MP4 video files.' },
  { title: 'BoothAlgorithm Multiplier', path: '/utils/booth-algorithm-multiplier', category: 'etc', description: 'Visualize Booth\'s multiplication algorithm.' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  if (selectedCategory) {
    const category = categories.find(c => c.slug === selectedCategory);
    const filteredPages = pages.filter(p => p.category === selectedCategory);

    return (
      <div className="container mx-auto p-4 sm:p-6">
        <Button onClick={handleBackToCategories} variant="outline" className="mb-6">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Back to Categories
        </Button>
        <h1 className="text-3xl font-bold mb-2">{category?.name}</h1>
        <p className="text-gray-500 mb-6">{category?.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPages.map((page) => (
            <Link href={page.path} key={page.path} passHref>
              <Card className="h-full hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{page.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-4xl font-bold text-center mb-2">Web Utils</h1>
      <p className="text-xl text-gray-600 text-center mb-8">A collection of useful tools and utilities.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card
            key={category.slug}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleSelectCategory(category.slug)}
          >
            <CardHeader className="flex flex-col items-center text-center">
              <category.icon className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
