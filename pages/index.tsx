import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  HiCode,
  HiDatabase,
  HiPuzzle,
  HiVideoCamera,
  HiChatAlt2,
  HiLightningBolt,
  HiLocationMarker,
  HiCollection,
} from 'react-icons/hi';

export default function Home() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-4xl font-bold text-center mb-2">Web Utils</h1>
      <p className="text-xl text-gray-600 text-center mb-8">A collection of useful tools and utilities.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <Link href="/category/json" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiCode className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>JSON</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Tools for working with JSON data.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/sql" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiDatabase className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>SQL</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Tools for database and SQL operations.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/game" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiPuzzle className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>Game</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Utilities for various games.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/image-video" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiVideoCamera className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>Image & Video</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Tools for video and image manipulation.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/discord" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiChatAlt2 className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>Discord</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Utilities for Discord.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/llm" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiLightningBolt className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>LLM</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Tools for Large Language Models.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/geolocation" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiLocationMarker className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>Geolocation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Tools for working with geographic data.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/etc" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiCollection className="h-12 w-12 mb-4 text-gray-500" />
              <CardTitle>Etc</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">Other miscellaneous utilities.</p>
            </CardContent>
          </Card>
        </Link>

      </div>
    </div>
  );
}
