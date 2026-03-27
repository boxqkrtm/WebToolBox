import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function DatabaseCategoryPage() {
  const { t } = useI18n();
  return (
    <PageContainer contentClassName="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('common.categories.database.title')}</h1>
        <p className="text-muted-foreground">{t('common.categories.database.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
        <Link href="/utils/escaped-string-decoder" passHref>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('common.tools.escapedStringDecoder.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.escapedStringDecoder.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/csv-sorter" passHref>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('common.tools.csvSorter.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.csvSorter.description')}</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/utils/xlsx-to-sql" passHref>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t('common.tools.xlsxToSql.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.xlsxToSql.description')}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
