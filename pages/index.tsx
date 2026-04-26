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
    <PageContainer contentClassName="space-y-10 sm:space-y-12">
      <PageIntro
        title={t('common.title')}
        description={t('common.subtitle')}
        align="center"
        eyebrow="Utility library"
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <LinkCard key={category.href} {...category} />
        ))}
      </section>
    </PageContainer>
  );
}
