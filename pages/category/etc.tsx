import { PageContainer } from '@/components/layout/PageContainer';
import { LinkCard } from '@/components/navigation/LinkCard';
import { PageIntro } from '@/components/navigation/PageIntro';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function EtcCategoryPage() {
  const { t } = useI18n();

  const tools = [
    {
      href: '/utils/discord-color-message-generator',
      title: t('common.tools.discordColorMessageGenerator.title'),
      description: t('common.tools.discordColorMessageGenerator.description'),
    },
    {
      href: '/utils/booth-algorithm-multiplier',
      title: t('common.tools.boothAlgorithmMultiplier.title'),
      description: t('common.tools.boothAlgorithmMultiplier.description'),
    },
    {
      href: '/utils/kakaotalk-chat-analyzer',
      title: t('common.tools.kakaotalkChatAnalyzer.title'),
      description: t('common.tools.kakaotalkChatAnalyzer.description'),
    },
  ];

  return (
    <PageContainer contentClassName="space-y-10">
      <PageIntro
        title={t('common.categories.etc.title')}
        description={t('common.categories.etc.description')}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <LinkCard key={tool.href} {...tool} />
        ))}
      </section>
    </PageContainer>
  );
}
