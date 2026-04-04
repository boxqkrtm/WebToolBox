'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadButton } from '@/components/ui/file-upload-button'
import { Label } from '@/components/ui/label'
import UtilsLayout from '@/components/layout/UtilsLayout'
import { useI18n } from '@/lib/i18n/i18nContext'

const BASE_URL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd'

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[index]}`
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}

// Custom dual-handle range slider component
interface RangeSliderProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onValueChange: (value: [number, number]) => void
}

function RangeSlider({ min, max, step, value, onValueChange }: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null)

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100
  const getValueFromPosition = (clientX: number) => {
    if (!trackRef.current) return min
    const rect = trackRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const rawValue = min + percentage * (max - min)
    return Math.round(rawValue / step) * step
  }

  const handleMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleTouchStart = (handle: 'start' | 'end') => (e: React.TouchEvent) => {
    setIsDragging(handle)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (clientX: number) => {
      const newValue = getValueFromPosition(clientX)
      if (isDragging === 'start') {
        const clampedStart = Math.max(min, Math.min(newValue, value[1] - step))
        onValueChange([clampedStart, value[1]])
      } else {
        const clampedEnd = Math.max(value[0] + step, Math.min(newValue, max))
        onValueChange([value[0], clampedEnd])
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

  const startPercent = getPercentage(value[0])
  const endPercent = getPercentage(value[1])

  return (
    <div
      ref={trackRef}
      className="relative h-6 w-full cursor-pointer"
    >
      {/* Track background */}
      <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 rounded-full bg-gray-200 dark:bg-gray-700" />

      {/* Selected range highlight */}
      <div
        className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-primary"
        style={{
          left: `${startPercent}%`,
          width: `${endPercent - startPercent}%`,
        }}
      />

      {/* Start handle */}
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md active:cursor-grabbing"
        style={{ left: `${startPercent}%` }}
        onMouseDown={handleMouseDown('start')}
        onTouchStart={handleTouchStart('start')}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[0]}
        tabIndex={0}
      />

      {/* End handle */}
      <div
        className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full border-2 border-white bg-primary shadow-md active:cursor-grabbing"
        style={{ left: `${endPercent}%` }}
        onMouseDown={handleMouseDown('end')}
        onTouchStart={handleTouchStart('end')}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value[1]}
        tabIndex={0}
      />
    </div>
  )
}

export default function GifCutterPage() {
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const [gifSrc, setGifSrc] = useState('')
  const [gifBlob, setGifBlob] = useState<Blob | null>(null)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const ffmpegRef = useRef<any>(null)

  const [sourceDuration, setSourceDuration] = useState(0)
  const [range, setRange] = useState<[number, number]>([0, 0])
  const [frameCount, setFrameCount] = useState(0)

  const startTime = range[0]
  const endTime = range[1]

  useEffect(() => {
    return () => {
      if (gifSrc) {
        URL.revokeObjectURL(gifSrc)
      }
    }
  }, [gifSrc])

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
      setStatus(t('common.tools.gifCutter.page.loadingFfmpeg'))
    }
    await ffmpegRef.current.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    setFfmpegLoaded(true)
    return ffmpegRef.current
  }

  const probeInfo = async (selected: File) => {
    try {
      const ffmpeg = await ensureFFmpegLoaded(false)
      const { fetchFile } = await import('@ffmpeg/util')

      await ffmpeg.writeFile('probe-input.gif', await fetchFile(selected))

      // Get duration
      await ffmpeg.ffprobe([
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        'probe-input.gif',
        '-o',
        'probe-duration.txt',
      ])

      const durationOutput = await ffmpeg.readFile('probe-duration.txt', 'utf8')
      const duration = parseFloat(String(durationOutput))

      // Get frame count
      await ffmpeg.ffprobe([
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=nb_frames',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        'probe-input.gif',
        '-o',
        'probe-frames.txt',
      ])

      const framesOutput = await ffmpeg.readFile('probe-frames.txt', 'utf8')
      const frames = parseInt(String(framesOutput), 10)

      if (Number.isFinite(duration) && duration > 0) {
        setSourceDuration(duration)
        setRange([0, duration])
      }

      if (Number.isFinite(frames) && frames > 0) {
        setFrameCount(frames)
      }

      await ffmpeg.deleteFile('probe-input.gif')
      await ffmpeg.deleteFile('probe-duration.txt')
      await ffmpeg.deleteFile('probe-frames.txt')
    } catch (error) {
      console.error(error)
    }
  }

  const onFileChange = (selected: File | null) => {
    if (!selected) return

    if (gifSrc) {
      URL.revokeObjectURL(gifSrc)
      setGifSrc('')
    }

    setFile(selected)
    setGifBlob(null)
    setOutputSize(null)
    setStatus('')
    setSourceDuration(0)
    setRange([0, 0])
    setFrameCount(0)

    void probeInfo(selected)
  }

  const process = async () => {
    if (!file || !sourceDuration) return

    const [startTime, endTime] = range
    setIsProcessing(true)
    setStatus(t('common.tools.gifCutter.page.processing'))

    try {
      const ffmpeg = await ensureFFmpegLoaded()
      const { fetchFile } = await import('@ffmpeg/util')

      await ffmpeg.writeFile('input.gif', await fetchFile(file))

      const duration = endTime - startTime

      // Use trim filter to cut the GIF
      await ffmpeg.exec([
        '-i',
        'input.gif',
        '-vf',
        `trim=start=${startTime}:duration=${duration},setpts=PTS-STARTPTS`,
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
      setStatus(t('common.tools.gifCutter.page.done'))

      await ffmpeg.deleteFile('input.gif')
      await ffmpeg.deleteFile('output.gif')
    } catch (error) {
      console.error(error)
      setStatus(t('common.tools.gifCutter.page.error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const selectedDuration = endTime - startTime

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('common.tools.gifCutter.title')}</h1>
        <p className="text-muted-foreground">{t('common.tools.gifCutter.description')}</p>

        <div className="space-y-2">
          <Label htmlFor="gif-upload">{t('common.tools.gifCutter.page.upload')}</Label>
          <FileUploadButton
            id="gif-upload"
            accept="image/gif"
            onFileSelect={onFileChange}
            label={t('common.tools.gifCutter.page.upload')}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              {t('common.tools.gifCutter.page.selected')}: {file.name}
              {sourceDuration > 0 && (
                <>
                  {' '}
                  ({formatTime(sourceDuration)} / {frameCount} {t('common.tools.gifCutter.page.frames')})
                </>
              )}
            </p>
          )}
        </div>

        {sourceDuration > 0 && (
          <div className="space-y-4 rounded-md border p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatTime(startTime)}</span>
                <span className="text-muted-foreground">
                  {t('common.tools.gifCutter.page.selectedDuration')}: {formatTime(selectedDuration)}
                </span>
                <span>{formatTime(endTime)}</span>
              </div>
              <RangeSlider
                min={0}
                max={sourceDuration}
                step={0.1}
                value={range}
                onValueChange={setRange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0:00.00</span>
                <span>{formatTime(sourceDuration)}</span>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {frameCount > 0 && (
                <p>
                  {t('common.tools.gifCutter.page.estimatedFrames')}:{' '}
                  {Math.max(1, Math.round((selectedDuration / sourceDuration) * frameCount))}
                </p>
              )}
            </div>

            <Button onClick={process} disabled={isProcessing || selectedDuration <= 0}>
              {isProcessing
                ? t('common.tools.gifCutter.page.processing')
                : t('common.tools.gifCutter.page.run')}
            </Button>
          </div>
        )}

        {status && <p className="text-sm text-muted-foreground">{status}</p>}

        {outputSize !== null && (
          <div className="rounded-md border p-3 text-sm">
            <p>
              {t('common.tools.gifCutter.page.outputSize')}:{' '}
              <span className="font-semibold">{formatBytes(outputSize)}</span>
            </p>
          </div>
        )}

        {gifSrc && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{t('common.tools.gifCutter.page.preview')}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifSrc}
              alt={t('common.tools.gifCutter.page.previewAlt')}
              className="max-h-[420px] rounded border"
            />
            <Button asChild>
              <a
                href={gifSrc}
                download={`${file?.name.replace(/\.gif$/i, '') || 'output'}-cut-${startTime.toFixed(1)}-${endTime.toFixed(1)}.gif`}
              >
                {t('common.tools.gifCutter.page.download')}
              </a>
            </Button>
          </div>
        )}
      </div>
    </UtilsLayout>
  )
}
