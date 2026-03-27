import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function LlmCategoryPage() {
  const { t } = useI18n();
  return (
    <PageContainer contentClassName="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('common.categories.llm.title')}</h1>
        <p className="text-muted-foreground">{t('common.categories.llm.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6">
        <Link href="/utils/llm-vram-calculator" passHref>
          <Card className="h-full hover:shadow-lg transition-colors">
            <CardHeader>
              <CardTitle>LLM VRAM Calculator (GGUF)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calculate VRAM requirements for GGUF models.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageContainer>
  );
}
