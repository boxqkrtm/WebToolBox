import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function EtcCategoryPage() {
  const { t } = useI18n();
  return (
    <div className="w-full p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2">{t('common.categories.etc.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('common.categories.etc.description')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
}
