import { CategoryPage } from '@/components/layout/CategoryPage';

export default function EtcCategoryPage() {
  return (
    <CategoryPage
      categoryKey="etc"
      tools={[
        { href: '/utils/booth-algorithm-multiplier', toolKey: 'boothAlgorithmMultiplier' },
        { href: '/utils/kakaomap-coord-opener', toolKey: 'kakaomapCoordOpener' },
        { href: '/utils/ntrip-scanner', toolKey: 'ntripScanner' },
        { href: '/utils/tetrio-replay-editor', toolKey: 'tetrioReplayEditor' },
        { href: '/utils/optical-puyo-reader', toolKey: 'opticalPuyoReader' },
      ]}
    />
  );
}
