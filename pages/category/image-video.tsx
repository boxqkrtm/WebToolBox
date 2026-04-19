import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function ImageVideoCategoryPage() {
  const { t } = useI18n();
  return (
    <PageContainer contentClassName="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('common.categories.imageVideo.title')}</h1>
        <p className="text-muted-foreground">{t('common.categories.imageVideo.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
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
        <Link href="/utils/qr-code-generator" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.qrCode.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.qrCode.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/svg-preview" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.svgPreview.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.svgPreview.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/video-recorder" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.videoRecorder.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.videoRecorder.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/gif-crop" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.gifCrop.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.gifCrop.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/gif-cutter" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.gifCutter.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.gifCutter.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/gif-speed-changer" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.gifSpeedChanger.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.gifSpeedChanger.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/gif-to-mp4-webp" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.gifToMp4Webp.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.gifToMp4Webp.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/gif-optimizer" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.gifOptimizer.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.gifOptimizer.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/mp4-to-gif" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.mp4ToGif.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.mp4ToGif.description')}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
