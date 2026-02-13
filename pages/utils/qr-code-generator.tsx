import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n/i18nContext';
import { HiClipboardCopy, HiDownload, HiUpload, HiClipboard } from 'react-icons/hi';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QRCode = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeCanvas), { ssr: false });

function decodeQrFromImageData(imageData: ImageData): string | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jsQR = require('jsqr');
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    return code ? code.data : null;
  } catch {
    return null;
  }
}

function loadImageAndDecode(
  src: string,
  onResult: (result: string | null, imgSrc: string) => void
) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onResult(null, src);
      return;
    }
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const decoded = decodeQrFromImageData(imageData);
    onResult(decoded, src);
  };
  img.onerror = () => {
    onResult(null, src);
  };
  img.src = src;
}

export default function QrCodePage() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('generate');
  const [decodedResult, setDecodedResult] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCanvasRef = useRef<HTMLDivElement>(null);

  const handleImageResult = useCallback(
    (result: string | null, imgSrc: string) => {
      setPreviewImage(imgSrc);
      if (result) {
        setDecodedResult(result);
        setError(null);
      } else {
        setDecodedResult(null);
        setError(t('common.tools.qrCode.noQrFound'));
      }
    },
    [t]
  );

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        loadImageAndDecode(dataUrl, handleImageResult);
      };
      reader.readAsDataURL(file);
    },
    [handleImageResult]
  );

  // Ctrl+V clipboard paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (activeTab !== 'read') return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob) {
            processFile(blob);
          }
          break;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [activeTab, processFile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleCopyResult = async () => {
    if (!decodedResult) return;
    await navigator.clipboard.writeText(decodedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrCanvasRef.current) return;
    const canvas = qrCanvasRef.current.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2">{t('common.tools.qrCode.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('common.tools.qrCode.description')}</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="generate" data-testid="tab-generate">
            {t('common.tools.qrCode.tabGenerate')}
          </TabsTrigger>
          <TabsTrigger value="read" data-testid="tab-read">
            {t('common.tools.qrCode.tabRead')}
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{t('common.tools.qrCode.generateTitle')}</h2>
            <Input
              data-testid="qr-code-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('common.tools.qrCode.placeholder')}
            />
            {text && (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="p-4 bg-white rounded-lg shadow inline-block"
                  data-testid="qr-code-canvas-container"
                  ref={qrCanvasRef}
                >
                  <QRCode value={text} size={256} key={text} />
                </div>
                <Button onClick={handleDownloadQr} variant="outline" data-testid="download-qr-btn">
                  <HiDownload className="mr-2 h-5 w-5" />
                  {t('common.tools.qrCode.downloadQr')}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Read Tab */}
        <TabsContent value="read">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{t('common.tools.qrCode.readTitle')}</h2>

            {/* Drop zone / Paste zone */}
            <div
              data-testid="qr-drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                ${isDragOver
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
                }
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-muted p-4">
                  <HiClipboard className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-lg">
                  {t('common.tools.qrCode.pasteHint')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t('common.tools.qrCode.dragDropHint')}
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <HiUpload className="mr-2 h-5 w-5" />
                  {t('common.tools.qrCode.uploadFile')}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                data-testid="qr-file-input"
              />
            </div>

            {/* Preview uploaded image */}
            {previewImage && (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-lg overflow-hidden shadow border max-w-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewImage}
                    alt={t('common.tools.qrCode.previewAlt')}
                    className="max-w-full h-auto max-h-64 object-contain"
                    data-testid="qr-preview-image"
                  />
                </div>
              </div>
            )}

            {/* Decoded Result */}
            {decodedResult && (
              <div
                className="bg-muted/50 rounded-lg p-4 border"
                data-testid="qr-decoded-result"
              >
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {t('common.tools.qrCode.decodedResult')}
                </p>
                <div className="flex items-start gap-2">
                  <p className="flex-1 font-mono text-sm break-all bg-background rounded p-3 border">
                    {decodedResult}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyResult}
                    data-testid="copy-result-btn"
                  >
                    <HiClipboardCopy className="mr-1 h-4 w-4" />
                    {copied
                      ? t('common.tools.qrCode.copied')
                      : t('common.tools.qrCode.copyResult')
                    }
                  </Button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && !decodedResult && previewImage && (
              <div
                className="bg-destructive/10 text-destructive rounded-lg p-4 border border-destructive/30"
                data-testid="qr-error"
              >
                <p>{error}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
