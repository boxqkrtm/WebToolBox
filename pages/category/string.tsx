import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function StringCategoryPage() {
  const { t } = useI18n();

  return (
    <PageContainer contentClassName="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('common.categories.string.title')}</h1>
        <p className="text-muted-foreground">{t('common.categories.string.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
        <Link href="/utils/discord-color-message-generator" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.discordColorMessageGenerator.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.discordColorMessageGenerator.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/utils/escaped-string-decoder" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.escapedStringDecoder.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.escapedStringDecoder.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/utils/kakaotalk-chat-analyzer" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.kakaotalkChatAnalyzer.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.kakaotalkChatAnalyzer.description')}</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/utils/csv-sorter" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>{t('common.tools.csvSorter.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('common.tools.csvSorter.description')}</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
