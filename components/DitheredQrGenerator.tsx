'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import dynamic from 'next/dynamic'
import { Download, Sparkles, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/lib/i18n/i18nContext'

const QRCodeCanvas = dynamic(
  () => import('qrcode.react').then((module) => module.QRCodeCanvas),
  { ssr: false }
)

const SOURCE_URL = 'https://codeberg.org/andrew-t/dithered-qr-codes'
const PREVIEW_SIZE = 512
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

type DitheredQrGeneratorProps = {
  className?: string
}

export default function DitheredQrGenerator({ className }: DitheredQrGeneratorProps) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('https://www.andrewt.net')
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [outputUrl, setOutputUrl] = useState('')
  const sourceRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isOpen || !text) return

    const sourceCanvas = sourceRef.current?.querySelector('canvas')
    const outputCanvas = outputRef.current
    if (!sourceCanvas || !outputCanvas) return

    const qrContext = outputCanvas.getContext('2d')
    if (!qrContext) return

    outputCanvas.width = PREVIEW_SIZE
    outputCanvas.height = PREVIEW_SIZE
    qrContext.imageSmoothingEnabled = false
    qrContext.drawImage(sourceCanvas, 0, 0, PREVIEW_SIZE, PREVIEW_SIZE)
    const qrPixels = qrContext.getImageData(0, 0, PREVIEW_SIZE, PREVIEW_SIZE)

    const drawOutput = (imagePixels?: ImageData) => {
      const pixels = qrContext.createImageData(PREVIEW_SIZE, PREVIEW_SIZE)
      for (let y = 0; y < PREVIEW_SIZE; y += 1) {
        for (let x = 0; x < PREVIEW_SIZE; x += 1) {
          const index = (y * PREVIEW_SIZE + x) * 4
          const qrIsDark = qrPixels.data[index] < 128
          let value = qrIsDark ? 0 : 255

          if (!qrIsDark && imagePixels) {
            const sourceValue =
              imagePixels.data[index] * 0.299 +
              imagePixels.data[index + 1] * 0.587 +
              imagePixels.data[index + 2] * 0.114
            const threshold = (BAYER_4X4[y % 4][x % 4] + 0.5) * 16
            value = sourceValue >= threshold ? 255 : 0
          }

          pixels.data[index] = value
          pixels.data[index + 1] = value
          pixels.data[index + 2] = value
          pixels.data[index + 3] = 255
        }
      }
      qrContext.putImageData(pixels, 0, 0)
      setOutputUrl(outputCanvas.toDataURL('image/png'))
    }

    if (!imageDataUrl) {
      drawOutput()
      return
    }

    const image = new Image()
    image.onload = () => {
      const imageCanvas = document.createElement('canvas')
      imageCanvas.width = PREVIEW_SIZE
      imageCanvas.height = PREVIEW_SIZE
      const imageContext = imageCanvas.getContext('2d')
      if (!imageContext) return
      imageContext.drawImage(image, 0, 0, PREVIEW_SIZE, PREVIEW_SIZE)
      drawOutput(imageContext.getImageData(0, 0, PREVIEW_SIZE, PREVIEW_SIZE))
    }
    image.src = imageDataUrl
  }, [imageDataUrl, isOpen, text])
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageDataUrl(String(reader.result ?? ''))
    reader.readAsDataURL(file)
  }

  const handleDownload = () => {
    if (!outputUrl) return
    const link = document.createElement('a')
    link.href = outputUrl
    link.download = 'dithered-qrcode.png'
    link.click()
  }

  return (
    <div className={className} data-testid="dithered-qr-tool">
      <Button type="button" onClick={() => setIsOpen((value) => !value)} data-testid="dithered-qr-fun-button">
        {isOpen ? <X className="mr-2 h-4 w-4" aria-hidden="true" /> : <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />}
        {t('common.tools.qrCode.fun')}
      </Button>

      {isOpen && (
        <div className="mt-4 rounded-xl border bg-muted/30 p-4" data-testid="dithered-qr-panel">
          <div className="mb-4 flex flex-col gap-1">
            <h3 className="font-semibold">{t('common.tools.qrCode.ditheredTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('common.tools.qrCode.ditheredDescription')}
            </p>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline hover:text-muted-foreground"
              data-testid="dithered-qr-source-link"
            >
              {t('common.tools.qrCode.sourceCode')}
            </a>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="space-y-3">
              <Input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder={t('common.tools.qrCode.ditheredTextPlaceholder')}
                aria-label={t('common.tools.qrCode.ditheredTextLabel')}
                data-testid="dithered-qr-text-input"
              />
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-3 text-sm hover:border-primary">
                <Upload className="h-4 w-4" aria-hidden="true" />
                <span>{t('common.tools.qrCode.ditheredImageLabel')}</span>
                <input
                  type="file"
                  accept="image/*,.webp"
                  onChange={handleImageUpload}
                  className="sr-only"
                  data-testid="dithered-qr-image-input"
                />
              </label>
              <p className="text-xs text-muted-foreground">
                {t('common.tools.qrCode.ditheredImageHint')}
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div ref={sourceRef} className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <QRCodeCanvas value={text || ' '} size={PREVIEW_SIZE} level="H" marginSize={4} />
              </div>
              <canvas ref={outputRef} className="w-full max-w-sm rounded-lg bg-white p-2" data-testid="dithered-qr-canvas" />
              <Button type="button" variant="outline" onClick={handleDownload} disabled={!outputUrl}>
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                {t('common.tools.qrCode.ditheredDownload')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
