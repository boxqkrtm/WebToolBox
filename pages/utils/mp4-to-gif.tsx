'use client'

import { useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
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

export default function Mp4ToGifPage() {
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [fps, setFps] = useState(12)
  const [resolutionScale, setResolutionScale] = useState(100)
  const [isConverting, setIsConverting] = useState(false)
  const [status, setStatus] = useState('')
  const [gifSrc, setGifSrc] = useState('')
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const ffmpegRef = useRef<any>(null)
  const [videoMeta, setVideoMeta] = useState<{ width: number; height: number; duration: number; frameRate: number } | null>(null)

  const estimatedSizeText = useMemo(() => {
    if (!file || !videoMeta || videoMeta.frameRate <= 0) {
      return t('common.tools.mp4ToGif.page.sizeEstimateUnavailable')
    }

    const frameFactor = fps / Math.max(videoMeta.frameRate, 1)
    const scaleFactor = (resolutionScale / 100) ** 2
    const compressionFactor = 0.72
    const estimatedBytes = Math.max(file.size * frameFactor * scaleFactor * compressionFactor, 1024)
    return formatBytes(estimatedBytes)
  }, [file, fps, resolutionScale, videoMeta, t])

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
      URL.revokeObjectURL(video.src)
    }

    video.onerror = () => {
      setVideoMeta(null)
      URL.revokeObjectURL(video.src)
    }
  }

  const ensureFFmpegLoaded = async () => {
    if (ffmpegLoaded && ffmpegRef.current) return ffmpegRef.current

    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util'),
    ])

    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg()
    }

    setStatus(t('common.tools.mp4ToGif.page.loadingFfmpeg'))
    await ffmpegRef.current.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    setFfmpegLoaded(true)
    return ffmpegRef.current
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    if (gifSrc) {
      URL.revokeObjectURL(gifSrc)
      setGifSrc('')
    }

    setFile(selected)
    setOutputSize(null)
    setStatus('')
    loadMetadata(selected)
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
      const vf = `fps=${fps},scale=iw*${scaleValue}/100:ih*${scaleValue}/100:flags=lanczos`

      await ffmpeg.exec(['-i', 'input.mp4', '-vf', vf, '-loop', '0', 'output.gif'])

      const data = await ffmpeg.readFile('output.gif')
      const bytes = data instanceof Uint8Array ? data : new Uint8Array(data as ArrayBuffer)
      const blob = new Blob([bytes], { type: 'image/gif' })
      const url = URL.createObjectURL(blob)

      if (gifSrc) {
        URL.revokeObjectURL(gifSrc)
      }

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

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('common.tools.mp4ToGif.page.title')}</h1>

        <div className="space-y-2">
          <Label htmlFor="mp4-upload">{t('common.tools.mp4ToGif.page.upload')}</Label>
          <Input id="mp4-upload" type="file" accept="video/mp4" onChange={onFileChange} />
          {file && <p className="text-sm text-muted-foreground">{t('common.tools.mp4ToGif.page.selected')}: {file.name}</p>}
        </div>

        <div className="space-y-2">
          <Label>{t('common.tools.mp4ToGif.page.fps')}: {fps}</Label>
          <Slider value={[fps]} min={1} max={30} step={1} onValueChange={(value) => setFps(value[0])} />
        </div>

        <div className="space-y-2">
          <Label>{t('common.tools.mp4ToGif.page.resolution')}: {resolutionScale}%</Label>
          <Slider value={[resolutionScale]} min={10} max={100} step={5} onValueChange={(value) => setResolutionScale(value[0])} />
        </div>

        <div className="rounded-md border p-3 text-sm">
          <p>{t('common.tools.mp4ToGif.page.estimatedSize')}: <span className="font-semibold">{estimatedSizeText}</span></p>
          {outputSize !== null && (
            <p className="mt-1">{t('common.tools.mp4ToGif.page.actualSize')}: <span className="font-semibold">{formatBytes(outputSize)}</span></p>
          )}
        </div>

        <Button onClick={convert} disabled={!file || isConverting}>
          {isConverting ? t('common.tools.mp4ToGif.page.converting') : t('common.tools.mp4ToGif.page.run')}
        </Button>

        {status && <p className="text-sm text-muted-foreground">{status}</p>}

        {gifSrc && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{t('common.tools.mp4ToGif.page.preview')}</h2>
            <img src={gifSrc} alt={t('common.tools.mp4ToGif.page.previewAlt')} className="max-h-[420px] rounded border" />
            <Button asChild>
              <a href={gifSrc} download={`${file?.name.replace(/\.mp4$/i, '') || 'converted'}.gif`}>
                {t('common.tools.mp4ToGif.page.download')}
              </a>
            </Button>
          </div>
        )}
      </div>
    </UtilsLayout>
  )
}
