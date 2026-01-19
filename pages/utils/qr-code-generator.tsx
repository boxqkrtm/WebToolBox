import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/i18nContext';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';
import dynamic from 'next/dynamic';

const QRCode = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeCanvas), { ssr: false });

export default function QrCodeGenerator() {
  const { t } = useI18n();
  const [text, setText] = useState('');

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Link href="/category/image-video" passHref>
        <Button variant="outline" className="mb-6">
          <HiArrowLeft className="mr-2 h-5 w-5" />
          {t('common.backToCategories')}
        </Button>
      </Link>
      <h1 className="text-3xl font-bold mb-2">{t('common.tools.qrCodeGenerator.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('common.tools.qrCodeGenerator.description')}</p>

      <div className="flex flex-col gap-4">
        <Input
          data-testid="qr-code-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('common.tools.qrCodeGenerator.placeholder')}
        />
        {text && (
          <div className="p-4 bg-white rounded-lg shadow" data-testid="qr-code-canvas-container">
            <QRCode value={text} size={256} key={text} />
          </div>
        )}
      </div>
    </div>
  );
}
