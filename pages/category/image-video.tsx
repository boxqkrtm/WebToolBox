import { CategoryPage } from '@/components/layout/CategoryPage';

export default function ImageVideoCategoryPage() {
  return (
    <CategoryPage
      categoryKey="imageVideo"
      tools={[
        { href: '/utils/image-to-base64', toolKey: 'imageToBase64' },
        { href: '/utils/mp4-gif-studio', toolKey: 'mp4GifStudio' },
        { href: '/utils/qr-code-generator', toolKey: 'qrCode' },
        { href: '/utils/svg-preview', toolKey: 'svgPreview' },
        { href: '/utils/video-recorder', toolKey: 'videoRecorder' },
      ]}
    />
  );
}
