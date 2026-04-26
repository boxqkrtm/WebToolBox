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
    <PageContainer contentClassName="space-y-12 sm:space-y-14">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
        <PageIntro
          title={t('common.title')}
          description={t('common.subtitle')}
          eyebrow={t('common.home.eyebrow')}
        />

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <p className="text-sm font-semibold text-muted-foreground">{t('common.home.overviewTitle')}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border bg-muted/50 p-4">
              <p className="text-3xl font-semibold text-foreground">6</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('common.home.stats.categories')}</p>
            </div>
            <div className="rounded-2xl border bg-muted/50 p-4">
              <p className="text-3xl font-semibold text-foreground">20+</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('common.home.stats.tools')}</p>
            </div>
            <div className="rounded-2xl border bg-muted/50 p-4">
              <p className="text-3xl font-semibold text-foreground">4</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('common.home.stats.languages')}</p>
            </div>
            <div className="rounded-2xl border bg-muted/50 p-4">
              <p className="text-3xl font-semibold text-foreground">∞</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{t('common.home.stats.browser')}</p>
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
