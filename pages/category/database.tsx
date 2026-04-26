import { PageContainer } from '@/components/layout/PageContainer';
import { LinkCard } from '@/components/navigation/LinkCard';
import { PageIntro } from '@/components/navigation/PageIntro';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function DatabaseCategoryPage() {
  const { t } = useI18n();

  const tools = [
    {
      href: '/utils/escaped-string-decoder',
      title: t('common.tools.escapedStringDecoder.title'),
      description: t('common.tools.escapedStringDecoder.description'),
    },
    {
      href: '/utils/csv-sorter',
      title: t('common.tools.csvSorter.title'),
      description: t('common.tools.csvSorter.description'),
    },
    {
      href: '/utils/xlsx-to-sql',
      title: t('common.tools.xlsxToSql.title'),
      description: t('common.tools.xlsxToSql.description'),
    },
  ];

  return (
    <PageContainer contentClassName="space-y-10">
      <PageIntro
        title={t('common.categories.database.title')}
        description={t('common.categories.database.description')}
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <LinkCard key={tool.href} {...tool} />
        ))}
      </section>
    </PageContainer>
  );
}
