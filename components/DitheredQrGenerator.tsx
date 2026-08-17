'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { Download, Sparkles, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/lib/i18n/i18nContext'
import {
  DEFAULT_DITHERED_QR,
  applyDitheredImage,
  encodeDitheredQr,
  imageDataToRgb,
} from '@/lib/ditheredQr'

const SOURCE_URL = 'https://codeberg.org/andrew-t/dithered-qr-codes'
const QUIET_ZONE_MODULES = 4

type DitheredQrGeneratorProps = {
  className?: string
  onOpenChange?: (open: boolean) => void
}

export default function DitheredQrGenerator({ className, onOpenChange }: DitheredQrGeneratorProps) {
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState('https://www.andrewt.net')
  const [imageDataUrl, setImageDataUrl] = useState('')
  const [outputUrl, setOutputUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const outputRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isOpen || !text || !imageDataUrl) return

    let cancelled = false
    const frame = requestAnimationFrame(() => {
      const outputCanvas = outputRef.current
      if (!outputCanvas) return

      const image = new Image()
      image.onload = () => {
        if (cancelled) return
        try {
          const settings = DEFAULT_DITHERED_QR
          const qr = encodeDitheredQr(text, settings)
          const probe = document.createElement('canvas')
          const probeContext = probe.getContext('2d')
          if (!probeContext) throw new Error('Canvas is unavailable')
          const raster = rasterizeImage(image, qr.length, probeContext)
          const dithered = applyDitheredImage(
            qr,
            imageDataToRgb(raster, settings),
            settings,
          )
          if (cancelled) return

          drawDitheredQr(outputCanvas, dithered, settings.scale, settings.forBlackBackground)
          setOutputUrl(outputCanvas.toDataURL('image/png'))
          setErrorMessage('')
        } catch (error) {
          if (cancelled) return
          setOutputUrl('')
          setErrorMessage(error instanceof Error ? error.message : t('common.tools.qrCode.ditheredError'))
        }
      }
      image.onerror = () => {
        if (cancelled) return
        setOutputUrl('')
        setErrorMessage(t('common.tools.qrCode.ditheredError'))
      }
      image.src = imageDataUrl
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [imageDataUrl, isOpen, t, text])

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
      <Button
        type="button"
        onClick={() => {
          const nextOpen = !isOpen
          setIsOpen(nextOpen)
          onOpenChange?.(nextOpen)
        }}
        data-testid="dithered-qr-fun-button"
      >
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
              {errorMessage && (
                <p className="text-sm text-destructive" data-testid="dithered-qr-error">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              {imageDataUrl ? (
                <canvas
                  ref={outputRef}
                  className="w-full max-w-sm rounded-lg bg-white p-2 [image-rendering:pixelated]"
                  data-testid="dithered-qr-canvas"
                />
              ) : (
                <div className="flex min-h-16 items-center justify-center text-center text-sm text-muted-foreground">
                  {t('common.tools.qrCode.ditheredImageHint')}
                </div>
              )}
              <Button type="button" variant="outline" onClick={handleDownload} disabled={!outputUrl || !imageDataUrl}>
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

function rasterizeImage(
  image: CanvasImageSource & { width: number; height: number },
  size: number,
  context: CanvasRenderingContext2D,
) {
  const canvas = context.canvas
  canvas.width = size
  canvas.height = size
  const sourceWidth = 'naturalWidth' in image && image.naturalWidth ? image.naturalWidth : image.width
  const sourceHeight = 'naturalHeight' in image && image.naturalHeight ? image.naturalHeight : image.height
  context.drawImage(image, 0, 0, sourceWidth, sourceHeight, 0, 0, size, size)
  return context.getImageData(0, 0, size, size)
}


function drawDitheredQr(
  canvas: HTMLCanvasElement,
  colors: number[][][],
  scale: number,
  forBlackBackground: boolean,
) {
  const margin = scale * QUIET_ZONE_MODULES
  const inner = colors.length
  const size = inner + margin * 2
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable')

  const pixels = context.createImageData(size, size)
  const background = forBlackBackground ? 0 : 255
  pixels.data.fill(255)
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = background
    pixels.data[i + 1] = background
    pixels.data[i + 2] = background
  }

  for (let y = 0; y < inner; y += 1) {
    for (let x = 0; x < inner; x += 1) {
      const [red, green, blue] = colors[y][x]
      const index = ((y + margin) * size + (x + margin)) * 4
      pixels.data[index] = red
      pixels.data[index + 1] = green
      pixels.data[index + 2] = blue
      pixels.data[index + 3] = 255
    }
  }

  context.putImageData(pixels, 0, 0)
}
