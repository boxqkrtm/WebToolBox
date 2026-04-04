'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileUploadButton } from '@/components/ui/file-upload-button'
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

export default function GifSpeedChangerPage() {
  const { t } = useI18n()
  const [file, setFile] = useState<File | null>(null)
  const [speed, setSpeed] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const [gifSrc, setGifSrc] = useState('')
  const [gifBlob, setGifBlob] = useState<Blob | null>(null)
  const [outputSize, setOutputSize] = useState<number | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const ffmpegRef = useRef<any>(null)
  const [sourceDuration, setSourceDuration] = useState(0)

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
      setStatus(t('common.tools.gifSpeedChanger.page.loadingFfmpeg'))
    }
    await ffmpegRef.current.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    setFfmpegLoaded(true)
    return ffmpegRef.current
  }

  const probeDuration = async (selected: File) => {
    try {
      const ffmpeg = await ensureFFmpegLoaded(false)
      const { fetchFile } = await import('@ffmpeg/util')

      await ffmpeg.writeFile('probe-input.gif', await fetchFile(selected))
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
        'probe-output.txt',
      ])

      const output = await ffmpeg.readFile('probe-output.txt', 'utf8')
      const duration = parseFloat(String(output))
      if (Number.isFinite(duration)) {
        setSourceDuration(duration)
      }

      await ffmpeg.deleteFile('probe-input.gif')
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
    setSourceDuration(0)
    void probeDuration(selected)
  }

  const process = async () => {
    if (!file) return

    setIsProcessing(true)
    setStatus(t('common.tools.gifSpeedChanger.page.processing'))

    try {
      const ffmpeg = await ensureFFmpegLoaded()
      const { fetchFile } = await import('@ffmpeg/util')

      await ffmpeg.writeFile('input.gif', await fetchFile(file))

      // Adjust setpts to change speed: 0.5 = 2x faster, 2.0 = 0.5x slower
      const setptsValue = 1 / speed
      await ffmpeg.exec([
        '-i',
        'input.gif',
        '-vf',
        `setpts=${setptsValue}*PTS`,
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
      setStatus(t('common.tools.gifSpeedChanger.page.done'))

      await ffmpeg.deleteFile('input.gif')
      await ffmpeg.deleteFile('output.gif')
    } catch (error) {
      console.error(error)
      setStatus(t('common.tools.gifSpeedChanger.page.error'))
    } finally {
      setIsProcessing(false)
    }
  }

  const estimatedDuration = sourceDuration > 0 ? sourceDuration / speed : 0

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('common.tools.gifSpeedChanger.title')}</h1>
        <p className="text-muted-foreground">{t('common.tools.gifSpeedChanger.description')}</p>

        <div className="space-y-2">
          <Label htmlFor="gif-upload">{t('common.tools.gifSpeedChanger.page.upload')}</Label>
          <FileUploadButton
            id="gif-upload"
            accept="image/gif"
            onFileSelect={onFileChange}
            label={t('common.tools.gifSpeedChanger.page.upload')}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              {t('common.tools.gifSpeedChanger.page.selected')}: {file.name}
            </p>
          )}
        </div>

        {file && (
          <div className="space-y-4 rounded-md border p-4">
            <div className="space-y-2">
              <Label>
                {t('common.tools.gifSpeedChanger.page.speed')}: {speed}x
                {speed > 1 && ` (${t('common.tools.gifSpeedChanger.page.faster')})`}
                {speed < 1 && ` (${t('common.tools.gifSpeedChanger.page.slower')})`}
              </Label>
              <Slider
                value={[speed]}
                min={0.25}
                max={4}
                step={0.25}
                onValueChange={(value) => setSpeed(value[0])}
              />
            </div>

            {sourceDuration > 0 && (
              <div className="text-sm text-muted-foreground">
                <p>
                  {t('common.tools.gifSpeedChanger.page.originalDuration')}: {sourceDuration.toFixed(2)}s
                </p>
                <p>
                  {t('common.tools.gifSpeedChanger.page.estimatedDuration')}: {estimatedDuration.toFixed(2)}s
                </p>
              </div>
            )}

            <Button onClick={process} disabled={isProcessing}>
              {isProcessing
                ? t('common.tools.gifSpeedChanger.page.processing')
                : t('common.tools.gifSpeedChanger.page.run')}
            </Button>
          </div>
        )}

        {status && <p className="text-sm text-muted-foreground">{status}</p>}

        {outputSize !== null && (
          <div className="rounded-md border p-3 text-sm">
            <p>
              {t('common.tools.gifSpeedChanger.page.outputSize')}:{' '}
              <span className="font-semibold">{formatBytes(outputSize)}</span>
            </p>
          </div>
        )}

        {gifSrc && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{t('common.tools.gifSpeedChanger.page.preview')}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifSrc}
              alt={t('common.tools.gifSpeedChanger.page.previewAlt')}
              className="max-h-[420px] rounded border"
            />
            <Button asChild>
              <a href={gifSrc} download={`${file?.name.replace(/\.gif$/i, '') || 'output'}-speed-${speed}x.gif`}>
                {t('common.tools.gifSpeedChanger.page.download')}
              </a>
            </Button>
          </div>
        )}
      </div>
    </UtilsLayout>
  )
}
