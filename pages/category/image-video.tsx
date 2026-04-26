import { PageContainer } from '@/components/layout/PageContainer';
import { LinkCard } from '@/components/navigation/LinkCard';
import { PageIntro } from '@/components/navigation/PageIntro';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function ImageVideoCategoryPage() {
  const { t } = useI18n();

  const tools = [
    {
      href: '/utils/image-to-base64',
      title: t('common.tools.imageToBase64.title'),
      description: t('common.tools.imageToBase64.description'),
    },
    {
      href: '/utils/video-cutter-encoder',
      title: t('common.tools.videoCutterEncoder.title'),
      description: t('common.tools.videoCutterEncoder.description'),
    },
    {
      href: '/utils/qr-code-generator',
      title: t('common.tools.qrCode.title'),
      description: t('common.tools.qrCode.description'),
    },
    {
      href: '/utils/svg-preview',
      title: t('common.tools.svgPreview.title'),
      description: t('common.tools.svgPreview.description'),
    },
    {
      href: '/utils/video-recorder',
      title: t('common.tools.videoRecorder.title'),
      description: t('common.tools.videoRecorder.description'),
    },
    {
      href: '/utils/gif-crop',
      title: t('common.tools.gifCrop.title'),
      description: t('common.tools.gifCrop.description'),
    },
    {
      href: '/utils/gif-cutter',
      title: t('common.tools.gifCutter.title'),
      description: t('common.tools.gifCutter.description'),
    },
    {
      href: '/utils/gif-speed-changer',
      title: t('common.tools.gifSpeedChanger.title'),
      description: t('common.tools.gifSpeedChanger.description'),
    },
    {
      href: '/utils/gif-to-mp4-webp',
      title: t('common.tools.gifToMp4Webp.title'),
      description: t('common.tools.gifToMp4Webp.description'),
    },
    {
      href: '/utils/gif-optimizer',
      title: t('common.tools.gifOptimizer.title'),
      description: t('common.tools.gifOptimizer.description'),
    },
    {
      href: '/utils/mp4-to-gif',
      title: t('common.tools.mp4ToGif.title'),
      description: t('common.tools.mp4ToGif.description'),
    },
  ];

  return (
    <PageContainer contentClassName="space-y-10">
      <PageIntro
        title={t('common.categories.imageVideo.title')}
        description={t('common.categories.imageVideo.description')}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <LinkCard key={tool.href} {...tool} />
        ))}
      </section>
    </PageContainer>
  );
}
