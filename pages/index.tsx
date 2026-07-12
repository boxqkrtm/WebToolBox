import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import {
  HiCode,
  HiVideoCamera,
  HiCollection,
} from 'react-icons/hi';
import type { IconType } from 'react-icons';
import { useI18n } from '@/lib/i18n/i18nContext';

const CATEGORIES: Array<{ href: string; icon: IconType; key: string }> = [
  { href: '/category/image-video', icon: HiVideoCamera, key: 'imageVideo' },
  { href: '/category/string', icon: HiCode, key: 'string' },
  { href: '/category/etc', icon: HiCollection, key: 'etc' },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <PageContainer contentClassName="space-y-10">
      <div className="space-y-3 pt-6 text-center sm:pt-10">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {t('common.title')}
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          {t('common.subtitle')}
        </p>
      </div>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-5">
        {CATEGORIES.map(({ href, icon: Icon, key }) => (
          <Link key={href} href={href} passHref>
            <Card className="group h-full cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-accent">
                  <Icon className="h-7 w-7" />
                </div>
                <CardTitle>{t(`common.categories.${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`common.categories.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
