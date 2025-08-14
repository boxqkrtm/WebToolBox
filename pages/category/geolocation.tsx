import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HiArrowLeft } from 'react-icons/hi';

export default function GeolocationCategoryPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-6">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Back to Categories
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-2">Geolocation</h1>
      <p className="text-gray-500 mb-6">Tools for working with geographic data.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/utils/kakaomap-coord-opener" passHref>
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>KakaoMap Coord Opener</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Open coordinates in KakaoMap.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/ntrip-scanner" passHref>
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>NTRIP Mount Point Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Scan for NTRIP mount points.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
