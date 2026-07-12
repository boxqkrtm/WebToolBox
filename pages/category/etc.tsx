import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function EtcCategoryPage() {
  const { t } = useI18n();
  return (
    <PageContainer contentClassName="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('common.categories.etc.title')}</h1>
        <p className="text-muted-foreground">{t('common.categories.etc.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
        <Link href="/utils/booth-algorithm-multiplier" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.boothAlgorithmMultiplier.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.boothAlgorithmMultiplier.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/utils/kakaomap-coord-opener" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.kakaomapCoordOpener.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.kakaomapCoordOpener.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/utils/ntrip-scanner" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.ntripScanner.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.ntripScanner.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/utils/tetrio-replay-editor" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.tetrioReplayEditor.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.tetrioReplayEditor.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/utils/optical-puyo-reader" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.opticalPuyoReader.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.opticalPuyoReader.description')}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
