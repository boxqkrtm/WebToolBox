import { useState } from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from "@/components/ui/label";
const pages = [
  { title: 'CSV Sorter', path: '/utils/csv-sorter' },
  { title: 'tetrio.replay-editor', path: '/utils/tetrio-replay-editor' },
  { title: 'Claude Token Counter', path: '/llm/claude-token-counter' }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Search Utils
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4"
          />
          <ul className="space-y-2">
            {filteredPages.map((page, index) => (
              <li key={index} className="text-lg text-blue-600 hover:underline">
                <Link href={page.path}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
