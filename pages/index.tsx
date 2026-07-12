import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  HiCode,
  HiVideoCamera,
  HiCollection,
} from 'react-icons/hi';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function Home() {
  const { t } = useI18n();
  
  return (
    <PageContainer contentClassName="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">{t('common.title')}</h1>
        <p className="text-xl text-muted-foreground">{t('common.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">

        <Link href="/category/image-video" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiVideoCamera className="h-12 w-12 mb-4 text-muted-foreground" />
              <CardTitle>{t('common.categories.imageVideo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('common.categories.imageVideo.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/string" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiCode className="h-12 w-12 mb-4 text-muted-foreground" />
              <CardTitle>{t('common.categories.string.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('common.categories.string.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/etc" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiCollection className="h-12 w-12 mb-4 text-muted-foreground" />
              <CardTitle>{t('common.categories.etc.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('common.categories.etc.description')}</p>
            </CardContent>
          </Card>
        </Link>

      </div>
    </PageContainer>
  );
}
