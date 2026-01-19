import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

type UtilsLayoutProps = {
  children: React.ReactNode;
  onPaste?: (e: React.ClipboardEvent) => void;
};

export default function UtilsLayout({ children, onPaste }: UtilsLayoutProps) {
  return (
    <div className="flex justify-center p-4 sm:p-6 bg-gray-50 min-h-screen" onPaste={onPaste}>
      <div className="w-full max-w-4xl">
        <div className="mb-4">
          <Link href="/" passHref>
            <Button variant="outline" className="flex items-center">
              <HiArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
