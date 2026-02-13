import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function GeolocationCategoryPage() {
  const { t } = useI18n();
  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2">{t('common.categories.geolocation.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('common.categories.geolocation.description')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/utils/kakaomap-coord-opener" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>KakaoMap Coord Opener</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Open coordinates in KakaoMap.</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/ntrip-scanner" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>NTRIP Mount Point Scanner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Scan for NTRIP mount points.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
