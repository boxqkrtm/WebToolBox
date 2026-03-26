import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useI18n } from '@/lib/i18n/i18nContext';
import { HiClipboardCopy, HiUpload, HiDownload, HiCheck } from 'react-icons/hi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SvgPreviewPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('file');
  const [svgContent, setSvgContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clipboard paste handler for SVG files
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (activeTab !== 'file') return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'string' && item.getAsFile?.()) {
          e.preventDefault();
          const blob = item.getAsFile();
          if (blob && blob.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (event) => {
              const text = event.target?.result as string;
              if (text) {
                setSvgContent(text);
                setPreviewUrl(URL.createObjectURL(blob));
                setError(null);
              }
            };
            reader.readAsText(blob);
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [activeTab]);

  const processFile = useCallback((file: File) => {
    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setSvgContent(text);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
      };
      reader.onerror = () => {
        setError(t('common.tools.svgPreview.invalidFile'));
      };
      reader.readAsText(file);
    } else {
      setError(t('common.tools.svgPreview.notSvgFile'));
    }
  }, [t]);

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSvgContent(text);
    if (text.trim()) {
      const blob = new Blob([text], { type: 'image/svg+xml' });
      setPreviewUrl(URL.createObjectURL(blob));
      setError(null);
    } else {
      setPreviewUrl(null);
      setError(null);
    }
  };

  const handleCopyResult = async () => {
    if (!svgContent) return;
    await navigator.clipboard.writeText(svgContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'svg-preview.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setSvgContent('');
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2">{t('common.tools.svgPreview.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('common.tools.svgPreview.description')}</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="file" data-testid="tab-file">
            {t('common.tools.svgPreview.tabFile')}
          </TabsTrigger>
          <TabsTrigger value="text" data-testid="tab-text">
            {t('common.tools.svgPreview.tabText')}
          </TabsTrigger>
        </TabsList>

        {/* File Tab */}
        <TabsContent value="file">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{t('common.tools.svgPreview.fileTitle')}</h2>

            {/* Drop zone */}
            <div
              data-testid="svg-drop-zone"
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
                  <HiUpload className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium text-lg">
                  {t('common.tools.svgPreview.pasteHint')}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t('common.tools.svgPreview.dragDropHint')}
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
                  {t('common.tools.svgPreview.uploadFile')}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                onChange={handleFileUpload}
                data-testid="svg-file-input"
              />
            </div>

            {error && (
              <div
                className="bg-destructive/10 text-destructive rounded-lg p-4 border border-destructive/30"
                data-testid="svg-error"
              >
                <p>{error}</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Text Tab */}
        <TabsContent value="text">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{t('common.tools.svgPreview.textTitle')}</h2>
            <Textarea
              data-testid="svg-code-input"
              value={svgContent}
              onChange={handleTextChange}
              placeholder={t('common.tools.svgPreview.placeholder')}
              className="min-h-[200px] font-mono text-sm"
            />
            {error && (
              <div
                className="bg-destructive/10 text-destructive rounded-lg p-4 border border-destructive/30"
                data-testid="svg-error"
              >
                <p>{error}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Result Section */}
      {previewUrl && (
        <Card className="mt-6" data-testid="svg-result-section">
          <CardHeader>
            <CardTitle>{t('common.tools.svgPreview.resultTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-lg overflow-hidden shadow border bg-white w-full flex items-center justify-center p-4">
                <object
                  data={previewUrl}
                  type="image/svg+xml"
                  className="max-w-full max-h-[500px]"
                  data-testid="svg-preview-render"
                >
                  <div className="text-muted-foreground">
                    {t('common.tools.svgPreview.renderError')}
                  </div>
                </object>
              </div>

              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={handleCopyResult}
                  data-testid="copy-svg-btn"
                >
                  {copied ? <HiCheck className="mr-2 h-5 w-5" /> : <HiClipboardCopy className="mr-2 h-5 w-5" />}
                  {copied ? t('common.tools.svgPreview.copied') : t('common.tools.svgPreview.copySvg')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadSvg}
                  data-testid="download-svg-btn"
                >
                  <HiDownload className="mr-2 h-5 w-5" />
                  {t('common.tools.svgPreview.downloadSvg')}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  data-testid="clear-btn"
                >
                  {t('common.tools.svgPreview.clear')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
