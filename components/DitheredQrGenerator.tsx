'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { Download, Sparkles, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/lib/i18n/i18nContext'
import encodeQR from 'qr'

const SOURCE_URL = 'https://codeberg.org/andrew-t/dithered-qr-codes'
const QR_VERSION = 6
const QR_SCALE = 3
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

function alignmentPositions(version: number) {
  if (version === 1) return []
  const count = Math.floor(version / 7) + 2
  const step = version === 32
    ? 26
    : Math.ceil((version * 4 + count * 2 + 1) / (count * 2 - 2)) * 2
  return [6, ...Array.from({ length: count - 1 }, (_, index) => version * 4 + 10 - (count - 2 - index) * step)]
}

function isLockedModule(version: number, x: number, y: number) {
  const size = version * 4 + 17
  const inFinder = (left: number, top: number) =>
    x >= left && x < left + 9 && y >= top && y < top + 9
  if (inFinder(0, 0) || inFinder(size - 8, 0) || inFinder(0, size - 8)) return true
  if (x === 6 || y === 6 || x === 8 || y === 8) return true

  const positions = alignmentPositions(version)
  return positions.some((centerX) =>
    positions.some((centerY) => {
      if ((centerX < 9 && centerY < 9) ||
          (centerX < 9 && centerY >= size - 8) ||
          (centerX >= size - 8 && centerY < 9)) {
        return false
      }
      return Math.abs(x - centerX) <= 2 && Math.abs(y - centerY) <= 2
    })
  )
}

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
  const outputRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isOpen || !text || !imageDataUrl) return

    const frame = requestAnimationFrame(() => {
      const outputCanvas = outputRef.current
      if (!outputCanvas) return

      const qr = encodeQR(text, 'raw', {
        border: 0,
        ecc: 'high',
        version: QR_VERSION,
        scale: 1,
      })
      const moduleCount = qr.length
      const innerSize = moduleCount * QR_SCALE
      const margin = QR_SCALE * 5
      const size = innerSize + margin * 2
      const context = outputCanvas.getContext('2d')
      if (!context) return

      outputCanvas.width = size
      outputCanvas.height = size
      context.fillStyle = 'white'
      context.fillRect(0, 0, size, size)

      const image = new Image()
      image.onload = () => {
        const imageCanvas = document.createElement('canvas')
        imageCanvas.width = innerSize
        imageCanvas.height = innerSize
        const imageContext = imageCanvas.getContext('2d')
        if (!imageContext) return
        imageContext.drawImage(image, 0, 0, innerSize, innerSize)
        const imagePixels = imageContext.getImageData(0, 0, innerSize, innerSize)
        const pixels = context.createImageData(size, size)
        pixels.data.fill(255)

        for (let moduleY = 0; moduleY < moduleCount; moduleY += 1) {
          for (let moduleX = 0; moduleX < moduleCount; moduleX += 1) {
            const locked = isLockedModule(QR_VERSION, moduleX, moduleY)
            for (let subY = 0; subY < QR_SCALE; subY += 1) {
              for (let subX = 0; subX < QR_SCALE; subX += 1) {
                const x = margin + moduleX * QR_SCALE + subX
                const y = margin + moduleY * QR_SCALE + subY
                const outputIndex = (y * size + x) * 4
                const imageX = moduleX * QR_SCALE + subX
                const imageY = moduleY * QR_SCALE + subY
                const imageIndex = (imageY * innerSize + imageX) * 4
                const sourceValue =
                  imagePixels.data[imageIndex] * 0.299 +
                  imagePixels.data[imageIndex + 1] * 0.587 +
                  imagePixels.data[imageIndex + 2] * 0.114
                const threshold = (BAYER_4X4[imageY % 4][imageX % 4] + 0.5) * 16
                const isDataPoint = subX === 1 && subY === 1
                const dark = locked || isDataPoint
                  ? qr[moduleY][moduleX]
                  : sourceValue < threshold
                const value = dark ? 0 : 255
                pixels.data[outputIndex] = value
                pixels.data[outputIndex + 1] = value
                pixels.data[outputIndex + 2] = value
                pixels.data[outputIndex + 3] = 255
              }
            }
          }
        }

        context.putImageData(pixels, 0, 0)
        setOutputUrl(outputCanvas.toDataURL('image/png'))
      }
      image.src = imageDataUrl
    })

    return () => cancelAnimationFrame(frame)
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
            </div>

            <div className="flex flex-col items-center gap-3">
              {imageDataUrl ? (
                <canvas
                  ref={outputRef}
                  className="w-full max-w-sm rounded-lg bg-white p-2"
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
