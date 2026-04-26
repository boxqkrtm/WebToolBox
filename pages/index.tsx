import { PageContainer } from '@/components/layout/PageContainer';
import { LinkCard } from '@/components/navigation/LinkCard';
import { PageIntro } from '@/components/navigation/PageIntro';
import {
  HiCollection,
  HiDatabase,
  HiLocationMarker,
  HiPhotograph,
  HiPuzzle,
  HiVideoCamera,
} from 'react-icons/hi';
import { useI18n } from '@/lib/i18n/i18nContext';

export default function Home() {
  const { t } = useI18n();

  const categories = [
    {
      href: '/category/database',
      title: t('common.categories.database.title'),
      description: t('common.categories.database.description'),
      icon: <HiDatabase className="h-5 w-5" />,
    },
    {
      href: '/category/game',
      title: t('common.categories.game.title'),
      description: t('common.categories.game.description'),
      icon: <HiPuzzle className="h-5 w-5" />,
    },
    {
      href: '/category/image-video',
      title: t('common.categories.imageVideo.title'),
      description: t('common.categories.imageVideo.description'),
      icon: <HiVideoCamera className="h-5 w-5" />,
    },
    {
      href: '/category/gif',
      title: t('common.categories.gif.title'),
      description: t('common.categories.gif.description'),
      icon: <HiPhotograph className="h-5 w-5" />,
    },
    {
      href: '/category/geolocation',
      title: t('common.categories.geolocation.title'),
      description: t('common.categories.geolocation.description'),
      icon: <HiLocationMarker className="h-5 w-5" />,
    },
    {
      href: '/category/etc',
      title: t('common.categories.etc.title'),
      description: t('common.categories.etc.description'),
      icon: <HiCollection className="h-5 w-5" />,
    },
  ];

  return (
    <PageContainer contentClassName="space-y-12 sm:space-y-16">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end">
        <PageIntro
          title={t('common.title')}
          description={t('common.subtitle')}
          eyebrow="Curated utility library"
        />

        <div className="rounded-[32px] border border-border/80 bg-card/70 p-6 sm:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Overview
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-medium text-foreground">6</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Core categories arranged for browsing and quick access.</p>
            </div>
            <div>
              <p className="text-3xl font-medium text-foreground">20+</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Focused utilities for media, data, games, and everyday tasks.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <LinkCard key={category.href} {...category} />
        ))}
      </section>
    </PageContainer>
  );
}
