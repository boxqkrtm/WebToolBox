import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  HiCode,
  HiDatabase,
  HiPuzzle,
  HiVideoCamera,
  HiLightningBolt,
  HiLocationMarker,
  HiCollection,
} from 'react-icons/hi';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function Home() {
  const { t } = useI18n();
  
  return (
    <div className="w-full p-4 sm:p-6">
      <h1 className="text-4xl font-bold text-center mb-2">{t('common.title')}</h1>
      <p className="text-xl text-muted-foreground text-center mb-8">{t('common.subtitle')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <Link href="/category/database" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiDatabase className="h-12 w-12 mb-4 text-muted-foreground" />
              <CardTitle>{t('common.categories.database.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('common.categories.database.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/game" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiPuzzle className="h-12 w-12 mb-4 text-muted-foreground" />
              <CardTitle>{t('common.categories.game.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('common.categories.game.description')}</p>
            </CardContent>
          </Card>
        </Link>

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

        <Link href="/category/llm" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiLightningBolt className="h-12 w-12 mb-4 text-muted-foreground" />
              <CardTitle>{t('common.categories.llm.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('common.categories.llm.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/category/geolocation" passHref>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
            <CardHeader className="flex flex-col items-center text-center">
              <HiLocationMarker className="h-12 w-12 mb-4 text-muted-foreground" />
              <CardTitle>{t('common.categories.geolocation.title')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{t('common.categories.geolocation.description')}</p>
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
    </div>
  );
}
