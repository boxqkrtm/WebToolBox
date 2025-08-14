import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HiArrowLeft } from 'react-icons/hi';

export default function GameCategoryPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-6">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Back to Categories
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-2">Game</h1>
      <p className="text-gray-500 mb-6">Utilities for various games.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/utils/tetrio-replay-editor" passHref>
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>Tetrio.replay-editor</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Edit Tetrio replay files.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/optical-puyo-reader" passHref>
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>OPR(Optical Puyo Reader)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Read Puyo Puyo fields from images.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
