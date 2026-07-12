import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useI18n } from '@/lib/i18n/i18nContext';

type CategoryPageProps = {
  categoryKey: string;
  tools: Array<{ href: string; toolKey: string }>;
};

export function CategoryPage({ categoryKey, tools }: CategoryPageProps) {
  const { t } = useI18n();

  return (
    <PageContainer contentClassName="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t(`common.categories.${categoryKey}.title`)}
        </h1>
        <p className="text-muted-foreground">
          {t(`common.categories.${categoryKey}.description`)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-5">
        {tools.map(({ href, toolKey }) => (
          <Link key={href} href={href} passHref>
            <Card className="group h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between gap-2 text-lg leading-snug">
                  <span>{t(`common.tools.${toolKey}.title`)}</span>
                  <HiArrowRight
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`common.tools.${toolKey}.description`)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
