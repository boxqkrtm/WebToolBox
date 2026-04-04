'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadButton } from '@/components/ui/file-upload-button'
import { Label } from '@/components/ui/label'
import UtilsLayout from '@/components/layout/UtilsLayout'
import { useI18n } from '@/lib/i18n/i18nContext'

const BASE_URL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd'
const MIN_CROP_SIZE = 5 // minimum 5% crop size

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[index]}`
}

// Custom vertical slider component
interface VerticalSliderProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  height: number
}

function VerticalSlider({ min, max, step, value, onValueChange, height }: VerticalSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'top' | 'bottom' | null>(null)

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100
  const getValueFromPosition = (clientY: number) => {
    if (!trackRef.current) return min
    const rect = trackRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    const rawValue = min + percentage * (max - min)
    return Math.round(rawValue / step) * step
  }

  const handleMouseDown = (handle: 'top' | 'bottom') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleTouchStart = (handle: 'top' | 'bottom') => (e: React.TouchEvent) => {
    setIsDragging(handle)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (clientY: number) => {
      const newValue = getValueFromPosition(clientY)
      if (isDragging === 'top') {
        const clampedTop = Math.max(min, Math.min(newValue, value[1] - step))
        onValueChange([clampedTop, value[1]])
      } else {
        const clampedBottom = Math.max(value[0] + step, Math.min(newValue, max))
        onValueChange([value[0], clampedBottom])
      }
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY)
    const onEnd = () => setIsDragging(null)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onEnd)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [isDragging, min, max, step, value, onValueChange])

  const topPercent = getPercentage(value[0])
  const bottomPercent = getPercentage(value[1])

  return (
    <div
      ref={trackRef}
      className="relative w-6 cursor-pointer"
      style={{ height }}
    >
      <div className="absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div
        className="absolute left-1/2 w-2 -translate-x-1/2 rounded-full bg-primary"
        style={{ top: `${topPercent}%`, height: `${bottomPercent - topPercent}%` }}
      />
      <div
        className="absolute left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md active:cursor-grabbing"
        style={{ top: `${topPercent}%` }}
        onMouseDown={handleMouseDown('top')}
        onTouchStart={handleTouchStart('top')}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[0]}
        tabIndex={0}
      />
      <div
        className="absolute left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md active:cursor-grabbing"
        style={{ top: `${bottomPercent}%` }}
        onMouseDown={handleMouseDown('bottom')}
        onTouchStart={handleTouchStart('bottom')}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        tabIndex={0}
      />
    </div>
  )
}

// Custom horizontal slider component
interface HorizontalSliderProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  width: number
}

function HorizontalSlider({ min, max, step, value, onValueChange, width }: HorizontalSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null)

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100
  const getValueFromPosition = (clientX: number) => {
    if (!trackRef.current) return min
    const rect = trackRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percentage * (max - min)
    return Math.round(rawValue / step) * step
  }

  const handleMouseDown = (handle: 'left' | 'right') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleTouchStart = (handle: 'left' | 'right') => (e: React.TouchEvent) => {
    setIsDragging(handle)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (clientX: number) => {
      const newValue = getValueFromPosition(clientX)
      if (isDragging === 'left') {
        const clampedLeft = Math.max(min, Math.min(newValue, value[1] - step))
        onValueChange([clampedLeft, value[1]])
      } else {
        const clampedRight = Math.max(value[0] + step, Math.min(newValue, max))
        onValueChange([value[0], clampedRight])
      }
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX)
    const onEnd = () => setIsDragging(null)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onEnd)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [isDragging, min, max, step, value, onValueChange])

  const leftPercent = getPercentage(value[0])
  const rightPercent = getPercentage(value[1])

  return (
    <div ref={trackRef} className="relative h-6 w-full cursor-pointer" style={{ width }}>
      <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div
        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
        style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
      />
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md active:cursor-grabbing"
        style={{ left: `${leftPercent}%` }}
        onMouseDown={handleMouseDown('left')}
        onTouchStart={handleTouchStart('left')}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[0]}
        tabIndex={0}
      />
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md active:cursor-grabbing"
        style={{ left: `${rightPercent}%` }}
        onMouseDown={handleMouseDown('right')}
        onTouchStart={handleTouchStart('right')}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        tabIndex={0}
      />
    </div>
  )
}

export default function GifCropPage() {
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const [gifSrc, setGifSrc] = useState('')
  const [previewSrc, setPreviewSrc] = useState('')
  const [gifBlob, setGifBlob] = useState<Blob | null>(null)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const ffmpegRef = useRef<any>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const [sourceWidth, setSourceWidth] = useState(0)
  const [sourceHeight, setSourceHeight] = useState(0)
  const [imageHeight, setImageHeight] = useState(420)

  // Crop settings - using range sliders [start, end]
  const [horizontalCrop, setHorizontalCrop] = useState<[number, number]>([0, 100])
  const [verticalCrop, setVerticalCrop] = useState<[number, number]>([0, 100])

  // Drag state for direct image manipulation
  const [dragMode, setDragMode] = useState<'move' | 'resize-left' | 'resize-right' | 'resize-top' | 'resize-bottom' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br' | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0, hCrop: [0, 100] as [number, number], vCrop: [0, 100] as [number, number] })

  const cropLeft = horizontalCrop[0]
  const cropRight = 100 - horizontalCrop[1]
  const cropTop = verticalCrop[0]
  const cropBottom = 100 - verticalCrop[1]

  useEffect(() => {
    return () => {
      if (gifSrc) URL.revokeObjectURL(gifSrc)
      if (previewSrc) URL.revokeObjectURL(previewSrc)
    }
  }, [gifSrc, previewSrc])

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageHeight(Math.min(420, imageRef.current.naturalHeight))
    }
  }

  const ensureFFmpegLoaded = async (withStatus = true) => {
    if (ffmpegLoaded && ffmpegRef.current) return ffmpegRef.current

    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util'),
    ])

    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg()
    }

    if (withStatus) {
      setStatus(t('common.tools.gifCrop.page.loadingFfmpeg'))
    }
    await ffmpegRef.current.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    setFfmpegLoaded(true)
    return ffmpegRef.current
  }

  const onFileChange = (selected: File | null) => {
    if (!selected) return

    if (gifSrc) {
      URL.revokeObjectURL(gifSrc)
      setGifSrc('')
    }
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc)
      setPreviewSrc('')
    }

    setFile(selected)
    setGifBlob(null)
    setOutputSize(null)
    setStatus('')

    setHorizontalCrop([0, 100])
    setVerticalCrop([0, 100])

    const url = URL.createObjectURL(selected)
    setPreviewSrc(url)

    const image = new Image()
    image.onload = () => {
      setSourceWidth(image.width)
      setSourceHeight(image.height)
    }
    image.src = url
  }

  // Get mouse position as percentage within image
  const getMousePercent = useCallback((clientX: number, clientY: number): { x: number; y: number } | null => {
    if (!imageContainerRef.current) return null
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
  }, [])

  // Determine drag mode based on mouse position over crop area
  const getDragMode = (x: number, y: number, target: HTMLElement | null): typeof dragMode | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br' => {
    // Check if clicking on specific edge/corner hit areas
    const edge = target?.getAttribute('data-edge')
    const corner = target?.getAttribute('data-corner')
    const area = target?.getAttribute('data-area')

    if (corner === 'tl') return 'resize-tl'
    if (corner === 'tr') return 'resize-tr'
    if (corner === 'bl') return 'resize-bl'
    if (corner === 'br') return 'resize-br'
    if (edge === 'left') return 'resize-left'
    if (edge === 'right') return 'resize-right'
    if (edge === 'top') return 'resize-top'
    if (edge === 'bottom') return 'resize-bottom'
    if (area === 'move') return 'move'

    // Fallback to percentage-based detection
    const margin = 5
    const centerX = (cropLeft + (100 - cropRight)) / 2
    const centerY = (cropTop + (100 - cropBottom)) / 2

    const inLeft = x >= cropLeft - margin && x <= cropLeft + margin
    const inRight = x >= 100 - cropRight - margin && x <= 100 - cropRight + margin
    const inTop = y >= cropTop - margin && y <= cropTop + margin
    const inBottom = y >= 100 - cropBottom - margin && y <= 100 - cropBottom + margin
    const inCenter = x > cropLeft + margin && x < 100 - cropRight - margin &&
                     y > cropTop + margin && y < 100 - cropBottom - margin

    // Corners first (diagonal resize)
    if (inLeft && inTop) return 'resize-tl'
    if (inRight && inTop) return 'resize-tr'
    if (inLeft && inBottom) return 'resize-bl'
    if (inRight && inBottom) return 'resize-br'
    // Then edges
    if (inLeft) return 'resize-left'
    if (inRight) return 'resize-right'
    if (inTop) return 'resize-top'
    if (inBottom) return 'resize-bottom'
    // Center
    if (inCenter) return 'move'
    return null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!previewSrc || gifSrc) return
    const pos = getMousePercent(e.clientX, e.clientY)
    if (!pos) return

    const target = e.target as HTMLElement
    const mode = getDragMode(pos.x, pos.y, target)
    if (mode) {
      e.preventDefault()
      setDragMode(mode)
      dragStartRef.current = {
        x: pos.x,
        y: pos.y,
        hCrop: [...horizontalCrop],
        vCrop: [...verticalCrop],
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!previewSrc || gifSrc) return
    const touch = e.touches[0]
    const target = e.target as HTMLElement
    const pos = getMousePercent(touch.clientX, touch.clientY)
    if (!pos) return

    const mode = getDragMode(pos.x, pos.y, target)
    if (mode) {
      setDragMode(mode)
      dragStartRef.current = {
        x: pos.x,
        y: pos.y,
        hCrop: [...horizontalCrop],
        vCrop: [...verticalCrop],
      }
    }
  }

  useEffect(() => {
    if (!dragMode) return

    const handleMove = (clientX: number, clientY: number) => {
      const pos = getMousePercent(clientX, clientY)
      if (!pos) return

      const { x: startX, y: startY, hCrop, vCrop } = dragStartRef.current
      const deltaX = pos.x - startX
      const deltaY = pos.y - startY

      if (dragMode === 'move') {
        const currentWidth = hCrop[1] - hCrop[0]
        const currentHeight = vCrop[1] - vCrop[0]

        let newLeft = hCrop[0] + deltaX
        let newTop = vCrop[0] + deltaY

        newLeft = Math.max(0, Math.min(100 - currentWidth, newLeft))
        newTop = Math.max(0, Math.min(100 - currentHeight, newTop))

        setHorizontalCrop([newLeft, newLeft + currentWidth])
        setVerticalCrop([newTop, newTop + currentHeight])
      } else if (dragMode === 'resize-left') {
        const newLeft = Math.max(0, Math.min(hCrop[1] - MIN_CROP_SIZE, hCrop[0] + deltaX))
        setHorizontalCrop([newLeft, hCrop[1]])
      } else if (dragMode === 'resize-right') {
        const newRight = Math.max(hCrop[0] + MIN_CROP_SIZE, Math.min(100, hCrop[1] + deltaX))
        setHorizontalCrop([hCrop[0], newRight])
      } else if (dragMode === 'resize-top') {
        const newTop = Math.max(0, Math.min(vCrop[1] - MIN_CROP_SIZE, vCrop[0] + deltaY))
        setVerticalCrop([newTop, vCrop[1]])
      } else if (dragMode === 'resize-bottom') {
        const newBottom = Math.max(vCrop[0] + MIN_CROP_SIZE, Math.min(100, vCrop[1] + deltaY))
        setVerticalCrop([vCrop[0], newBottom])
      } else if (dragMode === 'resize-tl') {
        // Top-left corner: resize both left and top
        const newLeft = Math.max(0, Math.min(hCrop[1] - MIN_CROP_SIZE, hCrop[0] + deltaX))
        const newTop = Math.max(0, Math.min(vCrop[1] - MIN_CROP_SIZE, vCrop[0] + deltaY))
        setHorizontalCrop([newLeft, hCrop[1]])
        setVerticalCrop([newTop, vCrop[1]])
      } else if (dragMode === 'resize-tr') {
        // Top-right corner: resize both right and top
        const newRight = Math.max(hCrop[0] + MIN_CROP_SIZE, Math.min(100, hCrop[1] + deltaX))
        const newTop = Math.max(0, Math.min(vCrop[1] - MIN_CROP_SIZE, vCrop[0] + deltaY))
        setHorizontalCrop([hCrop[0], newRight])
        setVerticalCrop([newTop, vCrop[1]])
      } else if (dragMode === 'resize-bl') {
        // Bottom-left corner: resize both left and bottom
        const newLeft = Math.max(0, Math.min(hCrop[1] - MIN_CROP_SIZE, hCrop[0] + deltaX))
        const newBottom = Math.max(vCrop[0] + MIN_CROP_SIZE, Math.min(100, vCrop[1] + deltaY))
        setHorizontalCrop([newLeft, hCrop[1]])
        setVerticalCrop([vCrop[0], newBottom])
      } else if (dragMode === 'resize-br') {
        // Bottom-right corner: resize both right and bottom
        const newRight = Math.max(hCrop[0] + MIN_CROP_SIZE, Math.min(100, hCrop[1] + deltaX))
        const newBottom = Math.max(vCrop[0] + MIN_CROP_SIZE, Math.min(100, vCrop[1] + deltaY))
        setHorizontalCrop([hCrop[0], newRight])
        setVerticalCrop([vCrop[0], newBottom])
      }
    }

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY)
    const onEnd = () => setDragMode(null)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onEnd)
    document.addEventListener('touchmove', onTouchMove)
    document.addEventListener('touchend', onEnd)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onEnd)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onEnd)
    }
  }, [dragMode, getMousePercent])

  const process = async () => {
    if (!file || !sourceWidth || !sourceHeight) return

    setIsProcessing(true)
    setStatus(t('common.tools.gifCrop.page.processing'))

    try {
      const ffmpeg = await ensureFFmpegLoaded()
      const { fetchFile } = await import('@ffmpeg/util')

      await ffmpeg.writeFile('input.gif', await fetchFile(file))

      const x = Math.round((cropLeft / 100) * sourceWidth)
      const y = Math.round((cropTop / 100) * sourceHeight)
      const cropWidth = Math.round(((horizontalCrop[1] - horizontalCrop[0]) / 100) * sourceWidth)
      const cropHeight = Math.round(((verticalCrop[1] - verticalCrop[0]) / 100) * sourceHeight)

      const validWidth = Math.max(2, cropWidth)
      const validHeight = Math.max(2, cropHeight)
      const validX = Math.min(x, sourceWidth - validWidth)
      const validY = Math.min(y, sourceHeight - validHeight)

      await ffmpeg.exec([
        '-i',
        'input.gif',
        '-vf',
        `crop=${validWidth}:${validHeight}:${validX}:${validY}`,
        '-loop',
        '0',
        'output.gif',
      ])

      const data = await ffmpeg.readFile('output.gif')
      const bytes = data instanceof Uint8Array ? data : new Uint8Array(data as ArrayBuffer)
      const blob = new Blob([bytes], { type: 'image/gif' })
      const url = URL.createObjectURL(blob)

      if (gifSrc) {
        URL.revokeObjectURL(gifSrc)
      }

      setGifBlob(blob)
      setGifSrc(url)
      setOutputSize(blob.size)
      setStatus(t('common.tools.gifCrop.page.done'))

      await ffmpeg.deleteFile('input.gif')
      await ffmpeg.deleteFile('output.gif')
    } catch (error) {
      console.error(error)
      setStatus(t('common.tools.gifCrop.page.error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const cropWidth = Math.round(((horizontalCrop[1] - horizontalCrop[0]) / 100) * sourceWidth)
  const cropHeight = Math.round(((verticalCrop[1] - verticalCrop[0]) / 100) * sourceHeight)

  const displayHeight = Math.min(420, sourceHeight || 420)
  const displayWidth = sourceWidth
    ? Math.round((displayHeight / sourceHeight) * sourceWidth)
    : 0

  // Determine cursor style based on hover position
  const [hoverCursor, setHoverCursor] = useState<string>('default')
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragMode || !previewSrc) return
    const pos = getMousePercent(e.clientX, e.clientY)
    if (!pos) return
    const target = e.target as HTMLElement
    const mode = getDragMode(pos.x, pos.y, target)
    if (mode === 'move') setHoverCursor('move')
    else if (mode?.startsWith('resize')) {
      // Set appropriate cursor for diagonal resize
      if (mode === 'resize-tl' || mode === 'resize-br') setHoverCursor('nwse-resize')
      else if (mode === 'resize-tr' || mode === 'resize-bl') setHoverCursor('nesw-resize')
      else if (mode === 'resize-left' || mode === 'resize-right') setHoverCursor('ew-resize')
      else if (mode === 'resize-top' || mode === 'resize-bottom') setHoverCursor('ns-resize')
    }
    else setHoverCursor('default')
  }

  const handleMouseLeave = () => {
    setHoverCursor('default')
  }

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('common.tools.gifCrop.title')}</h1>
        <p className="text-muted-foreground">{t('common.tools.gifCrop.description')}</p>

        <div className="space-y-2">
          <Label htmlFor="gif-upload">{t('common.tools.gifCrop.page.upload')}</Label>
          <FileUploadButton
            id="gif-upload"
            accept="image/gif"
            onFileSelect={onFileChange}
            label={t('common.tools.gifCrop.page.upload')}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              {t('common.tools.gifCrop.page.selected')}: {file.name} ({sourceWidth}x{sourceHeight})
            </p>
          )}
        </div>

        {previewSrc && !gifSrc && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{t('common.tools.gifCrop.page.originalPreview')}</h2>

            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center gap-2">
                <div
                  ref={imageContainerRef}
                  className="relative inline-block select-none"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: hoverCursor }}
                >
                  <img
                    ref={imageRef}
                    src={previewSrc}
                    alt={t('common.tools.gifCrop.page.previewAlt')}
                    className="max-h-[420px] rounded border"
                    onLoad={handleImageLoad}
                    draggable={false}
                  />
                  {/* Crop area overlay with extended hit areas */}
                  <div
                    className="absolute"
                    style={{
                      left: `${cropLeft}%`,
                      top: `${cropTop}%`,
                      right: `${cropRight}%`,
                      bottom: `${cropBottom}%`,
                    }}
                  >
                    {/* Main crop border (visible) */}
                    <div className="absolute inset-0 border-2 border-primary bg-primary/10" />

                    {/* Extended hit areas for edges - invisible but larger targets */}
                    <div
                      className="absolute left-0 top-0 w-6 h-full -translate-x-1/2 cursor-ew-resize"
                      data-edge="left"
                    />
                    <div
                      className="absolute right-0 top-0 w-6 h-full translate-x-1/2 cursor-ew-resize"
                      data-edge="right"
                    />
                    <div
                      className="absolute top-0 left-0 h-6 w-full -translate-y-1/2 cursor-ns-resize"
                      data-edge="top"
                    />
                    <div
                      className="absolute bottom-0 left-0 h-6 w-full translate-y-1/2 cursor-ns-resize"
                      data-edge="bottom"
                    />

                    {/* Corner hit areas - 20px radius */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 cursor-nwse-resize" data-corner="tl" />
                    <div className="absolute -top-3 -right-3 w-10 h-10 cursor-nesw-resize" data-corner="tr" />
                    <div className="absolute -bottom-3 -left-3 w-10 h-10 cursor-nesw-resize" data-corner="bl" />
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 cursor-nwse-resize" data-corner="br" />

                    {/* Center move area - 50% of crop area */}
                    <div
                      className="absolute cursor-move"
                      style={{
                        left: '25%',
                        top: '25%',
                        right: '25%',
                        bottom: '25%',
                      }}
                      data-area="move"
                    />

                    {/* Visible corner handles */}
                    <div className="absolute top-0 left-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />
                    <div className="absolute top-0 right-0 w-4 h-4 translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 -translate-x-1/2 translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 translate-x-1/2 translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />

                    {/* Visible edge handles */}
                    <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />
                    <div className="absolute bottom-0 left-1/2 w-4 h-4 -translate-x-1/2 translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />
                    <div className="absolute left-0 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />
                    <div className="absolute right-0 top-1/2 w-4 h-4 translate-x-1/2 -translate-y-1/2 bg-primary rounded-full border-2 border-white shadow-md z-10" />
                  </div>
                  {/* Dark overlay for non-selected area */}
                  <div
                    className="absolute inset-0 pointer-events-none bg-black/30"
                    style={{
                      clipPath: `polygon(
                        0% 0%,
                        100% 0%,
                        100% 100%,
                        0% 100%,
                        0% 0%,
                        ${cropLeft}% ${cropTop}%,
                        ${cropLeft}% ${100 - cropBottom}%,
                        ${100 - cropRight}% ${100 - cropBottom}%,
                        ${100 - cropRight}% ${cropTop}%,
                        ${cropLeft}% ${cropTop}%
                      )`,
                    }}
                  />
                </div>

                {/* Horizontal slider */}
                <div className="w-full max-w-[420px]">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{cropLeft.toFixed(0)}%</span>
                    <span className="text-primary font-medium">
                      {Math.max(2, cropWidth)} x {Math.max(2, cropHeight)} px
                    </span>
                    <span>{cropRight.toFixed(0)}%</span>
                  </div>
                  <HorizontalSlider
                    min={0}
                    max={100}
                    step={1}
                    value={horizontalCrop}
                    onValueChange={setHorizontalCrop}
                    width={Math.min(420, displayWidth || 420)}
                  />
                </div>
              </div>

              {/* Vertical slider */}
              {displayHeight > 0 && (
                <div className="flex flex-col items-center h-full">
                  <div className="text-xs text-muted-foreground mb-1">{cropTop.toFixed(0)}%</div>
                  <VerticalSlider
                    min={0}
                    max={100}
                    step={1}
                    value={verticalCrop}
                    onValueChange={setVerticalCrop}
                    height={displayHeight}
                  />
                  <div className="text-xs text-muted-foreground mt-1">{cropBottom.toFixed(0)}%</div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={process} disabled={isProcessing}>
                {isProcessing
                  ? t('common.tools.gifCrop.page.processing')
                  : t('common.tools.gifCrop.page.run')}
              </Button>
              {status && <span className="text-sm text-muted-foreground">{status}</span>}
            </div>

            <p className="text-xs text-muted-foreground">
              {t('common.tools.gifCrop.page.dragHint') || '드래그로 이동, 테두리 드래그로 크기 조절'}
            </p>
          </div>
        )}

        {outputSize !== null && (
          <div className="rounded-md border p-3 text-sm">
            <p>
              {t('common.tools.gifCrop.page.outputSize')}:{' '}
              <span className="font-semibold">{formatBytes(outputSize)}</span>
            </p>
          </div>
        )}

        {gifSrc && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{t('common.tools.gifCrop.page.croppedPreview')}</h2>
            <img
              src={gifSrc}
              alt={t('common.tools.gifCrop.page.previewAlt')}
              className="max-h-[420px] rounded border"
            />
            <Button asChild>
              <a href={gifSrc} download={`${file?.name.replace(/\.gif$/i, '') || 'output'}-cropped.gif`}>
                {t('common.tools.gifCrop.page.download')}
              </a>
            </Button>
          </div>
        )}
      </div>
    </UtilsLayout>
  )
}
