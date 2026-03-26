'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'

import { FileUploadButton } from '@/components/ui/file-upload-button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import UtilsLayout from '@/components/layout/UtilsLayout'
import { saveGifTransfer } from '@/lib/gifTransfer'
import { useI18n } from '@/lib/i18n/i18nContext'

const BASE_URL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd'

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[index]}`
}

export default function Mp4ToGifPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [fps, setFps] = useState(30)
  const [resolutionScale, setResolutionScale] = useState(100)
  const [isConverting, setIsConverting] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState('')
  const [gifSrc, setGifSrc] = useState('')
  const [gifBlob, setGifBlob] = useState<Blob | null>(null)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const ffmpegRef = useRef<any>(null)
  const [videoMeta, setVideoMeta] = useState<{
    width: number
    height: number
    duration: number
    frameRate: number
  } | null>(null)

  useEffect(() => {
    return () => {
      if (gifSrc) {
        URL.revokeObjectURL(gifSrc)
      }
    }
  }, [gifSrc])

  const scaledWidth = videoMeta
    ? Math.max(1, Math.round((videoMeta.width * resolutionScale) / 100))
    : 0
  const scaledHeight = videoMeta
    ? Math.max(1, Math.round((videoMeta.height * resolutionScale) / 100))
    : 0
  const maxSourceFps = Math.max(1, Math.round(videoMeta?.frameRate ?? 30))

  const parseFrameRate = (rawValue: string) => {
    const lines = rawValue
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    for (const line of lines) {
      if (line.includes('/')) {
        const [numeratorText, denominatorText] = line.split('/')
        const numerator = Number(numeratorText)
        const denominator = Number(denominatorText)
        if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0) {
          const frameRate = numerator / denominator
          if (frameRate > 0) {
            return frameRate
          }
        }
      }

      const frameRate = Number(line)
      if (Number.isFinite(frameRate) && frameRate > 0) {
        return frameRate
      }
    }

    return null
  }

  const loadMetadata = (selected: File) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = URL.createObjectURL(selected)

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0
      const frameRateGuess = duration > 0 ? 30 : 0
      setVideoMeta({
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        duration,
        frameRate: frameRateGuess,
      })
      setFps(Math.max(1, Math.round(frameRateGuess || 30)))
      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => {
      setVideoMeta(null)
      URL.revokeObjectURL(video.src)
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
      setStatus(t('common.tools.mp4ToGif.page.loadingFfmpeg'))
    }
    await ffmpegRef.current.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    setFfmpegLoaded(true)
    return ffmpegRef.current
  }

  const probeFrameRate = async (selected: File) => {
    try {
      const ffmpeg = await ensureFFmpegLoaded(false)
      const { fetchFile } = await import('@ffmpeg/util')

      await ffmpeg.writeFile('probe-input.mp4', await fetchFile(selected))
      await ffmpeg.ffprobe([
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=avg_frame_rate,r_frame_rate',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        'probe-input.mp4',
        '-o',
        'probe-output.txt',
      ])

      const output = await ffmpeg.readFile('probe-output.txt', 'utf8')
      const parsedFrameRate = parseFrameRate(String(output))

      if (parsedFrameRate) {
        setVideoMeta((current) => {
          if (!current) return current
          return {
            ...current,
            frameRate: parsedFrameRate,
          }
        })
        setFps(Math.max(1, Math.round(parsedFrameRate)))
      }

      await ffmpeg.deleteFile('probe-input.mp4')
      await ffmpeg.deleteFile('probe-output.txt')
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
    loadMetadata(selected)
    void probeFrameRate(selected)
  }

  const convert = async () => {
    if (!file) return

    setIsConverting(true)
    setStatus(t('common.tools.mp4ToGif.page.converting'))

    try {
      const ffmpeg = await ensureFFmpegLoaded()
      const { fetchFile } = await import('@ffmpeg/util')

      await ffmpeg.writeFile('input.mp4', await fetchFile(file))

      const scaleValue = Math.max(1, Math.round(resolutionScale))
      const vf = `fps=${fps},setpts=N/(${fps}*TB),scale=iw*${scaleValue}/100:ih*${scaleValue}/100:flags=lanczos`

      await ffmpeg.exec(['-i', 'input.mp4', '-vf', vf, '-loop', '0', 'output.gif'])

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
      setStatus(t('common.tools.mp4ToGif.page.done'))

      await ffmpeg.deleteFile('input.mp4')
      await ffmpeg.deleteFile('output.gif')
    } catch (error) {
      console.error(error)
      setStatus(t('common.tools.mp4ToGif.page.error'))
    } finally {
      setIsConverting(false)
    }
  }

  const handleOpenOptimizer = async () => {
    if (!gifBlob) return

    setIsSending(true)
    try {
      const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'converted'
      const transferId = await saveGifTransfer({
        blob: gifBlob,
        fileName: `${baseName}.gif`,
        mimeType: 'image/gif',
      })

      await router.push(`/utils/gif-optimizer?transfer=${encodeURIComponent(transferId)}`)
    } catch (error) {
      console.error(error)
      setStatus(t('common.tools.mp4ToGif.page.transferError'))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('common.tools.mp4ToGif.page.title')}</h1>

        <div className="space-y-2">
          <Label htmlFor="mp4-upload">{t('common.tools.mp4ToGif.page.upload')}</Label>
          <FileUploadButton
            id="mp4-upload"
            accept="video/mp4"
            onFileSelect={onFileChange}
            label={t('common.tools.mp4ToGif.page.upload')}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              {t('common.tools.mp4ToGif.page.selected')}: {file.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            {t('common.tools.mp4ToGif.page.fps')}: {fps} ({videoMeta ? videoMeta.frameRate.toFixed(2) : '0.00'} fps)
          </Label>
          <Slider
            value={[fps]}
            min={1}
            max={maxSourceFps}
            step={1}
            onValueChange={(value) => setFps(value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label>
            {t('common.tools.mp4ToGif.page.resolution')}: {resolutionScale}%
            {videoMeta ? ` (${scaledWidth}x${scaledHeight})` : ''}
          </Label>
          <Slider
            value={[resolutionScale]}
            min={1}
            max={100}
            step={1}
            onValueChange={(value) => setResolutionScale(value[0])}
          />
        </div>

        {outputSize !== null && (
          <div className="rounded-md border p-3 text-sm">
            <p>
              {t('common.tools.mp4ToGif.page.actualSize')}:{' '}
              <span className="font-semibold">{formatBytes(outputSize)}</span>
            </p>
          </div>
        )}

        <Button onClick={convert} disabled={!file || isConverting}>
          {isConverting ? t('common.tools.mp4ToGif.page.converting') : t('common.tools.mp4ToGif.page.run')}
        </Button>

        {status && <p className="text-sm text-muted-foreground">{status}</p>}

        {gifSrc && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{t('common.tools.mp4ToGif.page.preview')}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifSrc}
              alt={t('common.tools.mp4ToGif.page.previewAlt')}
              className="max-h-[420px] rounded border"
            />
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href={gifSrc} download={`${file?.name.replace(/\.mp4$/i, '') || 'converted'}.gif`}>
                  {t('common.tools.mp4ToGif.page.download')}
                </a>
              </Button>
              <Button variant="outline" onClick={handleOpenOptimizer} disabled={isSending}>
                {isSending
                  ? t('common.tools.mp4ToGif.page.sendingButton')
                  : t('common.tools.mp4ToGif.page.optimizeButton')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </UtilsLayout>
  )
}
