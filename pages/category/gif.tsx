import { PageContainer } from '@/components/layout/PageContainer';
import { LinkCard } from '@/components/navigation/LinkCard';
import { PageIntro } from '@/components/navigation/PageIntro';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function GifCategoryPage() {
  const { t } = useI18n();

  const tools = [
    {
      href: '/utils/mp4-to-gif',
      title: t('common.tools.mp4ToGif.title'),
      description: t('common.tools.mp4ToGif.description'),
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
      href: '/utils/gif-speed-changer',
      title: t('common.tools.gifSpeedChanger.title'),
      description: t('common.tools.gifSpeedChanger.description'),
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
  ];

  return (
    <PageContainer contentClassName="space-y-10">
      <PageIntro
        title={t('common.categories.gif.title')}
        description={t('common.categories.gif.description')}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <LinkCard key={tool.href} {...tool} />
        ))}
      </section>
    </PageContainer>
  );
}
