import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HiArrowLeft } from 'react-icons/hi';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function ImageVideoCategoryPage() {
  const { t } = useI18n();
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Link href="/" passHref>
        <Button variant="outline" className="mb-6">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          {t('common.backToCategories')}
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-2">{t('common.categories.imageVideo.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('common.categories.imageVideo.description')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/utils/image-to-base64" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.imageToBase64.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.imageToBase64.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/video-cutter-encoder" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.videoCutterEncoder.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.videoCutterEncoder.description')}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
