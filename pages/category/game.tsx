import { PageContainer } from '@/components/layout/PageContainer';
import { LinkCard } from '@/components/navigation/LinkCard';
import { PageIntro } from '@/components/navigation/PageIntro';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function GameCategoryPage() {
  const { t } = useI18n();

  const tools = [
    {
      href: '/utils/tetrio-replay-editor',
      title: t('common.tools.tetrioReplayEditor.title'),
      description: t('common.tools.tetrioReplayEditor.description'),
    },
    {
      href: '/utils/optical-puyo-reader',
      title: t('common.tools.opticalPuyoReader.title'),
      description: t('common.tools.opticalPuyoReader.description'),
    },
  ];

  return (
    <PageContainer contentClassName="space-y-10">
      <PageIntro
        title={t('common.categories.game.title')}
        description={t('common.categories.game.description')}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <LinkCard key={tool.href} {...tool} />
        ))}
      </section>
    </PageContainer>
  );
}
