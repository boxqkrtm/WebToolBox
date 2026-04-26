import { PageContainer } from '@/components/layout/PageContainer';
import { LinkCard } from '@/components/navigation/LinkCard';
import { PageIntro } from '@/components/navigation/PageIntro';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function GeolocationCategoryPage() {
  const { t } = useI18n();

  const tools = [
    {
      href: '/utils/kakaomap-coord-opener',
      title: t('common.tools.kakaomapCoordOpener.title'),
      description: t('common.tools.kakaomapCoordOpener.description'),
    },
    {
      href: '/utils/ntrip-scanner',
      title: t('common.tools.ntripScanner.title'),
      description: t('common.tools.ntripScanner.description'),
    },
  ];

  return (
    <PageContainer contentClassName="space-y-10">
      <PageIntro
        title={t('common.categories.geolocation.title')}
        description={t('common.categories.geolocation.description')}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <LinkCard key={tool.href} {...tool} />
        ))}
      </section>
    </PageContainer>
  );
}
