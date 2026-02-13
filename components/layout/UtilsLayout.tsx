import { HiArrowLeft } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

type UtilsLayoutProps = {
  children: React.ReactNode;
  onPaste?: (e: React.ClipboardEvent) => void;
};

export default function UtilsLayout({ children, onPaste }: UtilsLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/');
  };

  return (
    <div className="flex justify-center p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen" onPaste={onPaste}>
      <div className="w-full">
        <div className="mb-4">
          <Button type="button" variant="outline" className="flex items-center" onClick={handleBack}>
            <HiArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <main>{children}</main>
      </div>
    </div>
  );
}
