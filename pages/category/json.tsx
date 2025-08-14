import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HiArrowLeft } from 'react-icons/hi';

export default function JsonCategoryPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-6">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          Back to Categories
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-2">JSON</h1>
      <p className="text-gray-500 mb-6">Tools for working with JSON data.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/utils/escaped-string-decoder" passHref>
          <Card className="h-full hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle>Escaped String Decoder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Decode escaped strings.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
