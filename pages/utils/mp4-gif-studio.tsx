'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { CSSProperties } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import type { LogEventCallback, ProgressEventCallback } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import {
  Crop,
  Download,
  FileVideo2,
  Gauge,
  LoaderCircle,
  Pause,
  Play,
  RotateCcw,
  Scissors,
  Settings2,
} from 'lucide-react'

import CropOverlay from '@/components/media/CropOverlay'
import type { CropOverlayLabels, CropRect } from '@/components/media/CropOverlay'
import {
  TimeRangeControl,
  formatStudioTime,
} from '@/components/media/TimeRangeControl'
import type { TimeRangeEndpoint } from '@/components/media/TimeRangeControl'
import UtilsLayout from '@/components/layout/UtilsLayout'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { FileUploadButton } from '@/components/ui/file-upload-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useI18n } from '@/lib/i18n/i18nContext'
import {
  FFMPEG_CORE_BASE_URL,
  MAX_SOURCE_BYTES,
  buildGifPreviewCommand,
  buildStudioExportPlan,
  buildStudioProbeCommand,
  estimateMp4Bytes,
  formatStudioBytes,
  getStudioOutputGeometry,
  parseStudioProbe,
} from '@/lib/media/mp4GifStudio'
import type {
  StudioExportPlan,
  StudioMediaMetadata,
  StudioOutputFormat,
  StudioSettings,
} from '@/lib/media/mp4GifStudio'

const UPLOAD_ID = 'mp4-gif-studio-upload'
const FULL_CROP: CropRect = { x: 0, y: 0, width: 100, height: 100 }

type StudioPhase =
  | 'idle'
  | 'loadingEngine'
  | 'analyzing'
  | 'preparingPreview'
  | 'ready'
  | 'exporting'
  | 'complete'

type PreviewKind = 'video' | 'image'

type ResultState = {
  plan: StudioExportPlan
  fileName: string
  size: number
}

const PHASE_KEYS: Record<Exclude<StudioPhase, 'idle'>, string> = {
  loadingEngine: 'common.tools.mp4GifStudio.page.status.loadingEngine',
  analyzing: 'common.tools.mp4GifStudio.page.status.analyzing',
  preparingPreview: 'common.tools.mp4GifStudio.page.status.preparingPreview',
  ready: 'common.tools.mp4GifStudio.page.status.ready',
  exporting: 'common.tools.mp4GifStudio.page.status.exporting',
  complete: 'common.tools.mp4GifStudio.page.status.exportComplete',
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

async function safeDelete(ffmpeg: FFmpeg, path: string) {
  if (!path) return
  try {
    await ffmpeg.deleteFile(path)
  } catch {
    // The virtual file may not exist after a failed or cancelled job.
  }
}

function getSourceKind(file: File): 'mp4' | 'gif' | null {
  const lowerName = file.name.toLowerCase()
  if (file.type === 'video/mp4' || lowerName.endsWith('.mp4')) return 'mp4'
  if (file.type === 'image/gif' || lowerName.endsWith('.gif')) return 'gif'
  return null
}

function getBaseName(fileName: string) {
  const withoutExtension = fileName.replace(/\.(?:mp4|gif)$/i, '')
  return withoutExtension || 'media'
}

function getOutputMimeType(format: StudioOutputFormat) {
  if (format === 'mp4') return 'video/mp4'
  if (format === 'gif') return 'image/gif'
  return 'image/webp'
}

export default function Mp4GifStudioPage() {
  const { t } = useI18n()
  const ffmpegRef = useRef<FFmpeg | null>(null)
  const loadPromiseRef = useRef<Promise<FFmpeg> | null>(null)
  const inputNameRef = useRef('')
  const jobIdRef = useRef(0)
  const previewRef = useRef<HTMLVideoElement>(null)

  const [uploadKey, setUploadKey] = useState(0)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<StudioMediaMetadata | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewKind, setPreviewKind] = useState<PreviewKind>('video')
  const [phase, setPhase] = useState<StudioPhase>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const [trimRange, setTrimRange] = useState<[number, number]>([0, 0])
  const [crop, setCrop] = useState<CropRect>(FULL_CROP)
  const [speed, setSpeed] = useState(1)
  const [scale, setScale] = useState(100)
  const [format, setFormat] = useState<StudioOutputFormat>('mp4')

  const [videoBitrateKbps, setVideoBitrateKbps] = useState(2500)
  const [mp4FrameRate, setMp4FrameRate] = useState<'source' | 24 | 30 | 60>('source')
  const [mp4Preset, setMp4Preset] = useState<'ultrafast' | 'veryfast' | 'medium'>('veryfast')
  const [includeAudio, setIncludeAudio] = useState(true)
  const [audioBitrateKbps, setAudioBitrateKbps] = useState(128)

  const [gifFps, setGifFps] = useState(15)
  const [gifColors, setGifColors] = useState(256)
  const [gifDither, setGifDither] = useState<'none' | 'bayer' | 'floyd_steinberg' | 'sierra2_4a'>('bayer')
  const [gifLoopForever, setGifLoopForever] = useState(true)

  const [webpFps, setWebpFps] = useState(20)
  const [webpQuality, setWebpQuality] = useState(75)
  const [webpCompressionLevel, setWebpCompressionLevel] = useState(4)
  const [webpLossless, setWebpLossless] = useState(false)
  const [webpLoopForever, setWebpLoopForever] = useState(true)

  const [result, setResult] = useState<ResultState | null>(null)
  const [resultUrl, setResultUrl] = useState('')

  const isBusy =
    phase === 'loadingEngine' ||
    phase === 'analyzing' ||
    phase === 'preparingPreview' ||
    phase === 'exporting'
  const isExporting = phase === 'exporting'

  const settings = useMemo<StudioSettings>(
    () => ({
      format,
      trimRange,
      crop,
      speed,
      scale,
      mp4: {
        videoBitrateKbps,
        frameRate: mp4FrameRate,
        preset: mp4Preset,
        includeAudio,
        audioBitrateKbps,
      },
      gif: {
        fps: gifFps,
        colors: gifColors,
        dither: gifDither,
        loopForever: gifLoopForever,
      },
      webp: {
        fps: webpFps,
        quality: webpQuality,
        compressionLevel: webpCompressionLevel,
        lossless: webpLossless,
        loopForever: webpLoopForever,
      },
    }),
    [
      audioBitrateKbps,
      crop,
      format,
      gifColors,
      gifDither,
      gifFps,
      gifLoopForever,
      includeAudio,
      mp4FrameRate,
      mp4Preset,
      scale,
      speed,
      trimRange,
      videoBitrateKbps,
      webpCompressionLevel,
      webpFps,
      webpLoopForever,
      webpLossless,
      webpQuality,
    ]
  )

  const cropLabels = useMemo<CropOverlayLabels>(
    () => ({
      group: t('common.tools.mp4GifStudio.page.crop.selection'),
      move: t('common.tools.mp4GifStudio.page.crop.move'),
      topLeft: t('common.tools.mp4GifStudio.page.crop.handles.topLeft'),
      top: t('common.tools.mp4GifStudio.page.crop.handles.top'),
      topRight: t('common.tools.mp4GifStudio.page.crop.handles.topRight'),
      right: t('common.tools.mp4GifStudio.page.crop.handles.right'),
      bottomRight: t('common.tools.mp4GifStudio.page.crop.handles.bottomRight'),
      bottom: t('common.tools.mp4GifStudio.page.crop.handles.bottom'),
      bottomLeft: t('common.tools.mp4GifStudio.page.crop.handles.bottomLeft'),
      left: t('common.tools.mp4GifStudio.page.crop.handles.left'),
    }),
    [t]
  )

  const outputGeometry = useMemo(() => {
    if (!metadata) return null
    try {
      return getStudioOutputGeometry(metadata, settings)
    } catch {
      return null
    }
  }, [metadata, settings])

  const estimatedMp4Size = useMemo(() => {
    if (!metadata || format !== 'mp4') return 0
    return estimateMp4Bytes(metadata, settings)
  }, [format, metadata, settings])

  const phaseText = phase === 'idle' ? '' : t(PHASE_KEYS[phase])

  const ensureFfmpeg = useCallback(async () => {
    if (ffmpegRef.current?.loaded) return ffmpegRef.current
    if (loadPromiseRef.current) return loadPromiseRef.current

    setPhase('loadingEngine')
    const loadPromise = (async () => {
      const ffmpeg = new FFmpeg()
      try {
        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${FFMPEG_CORE_BASE_URL}/ffmpeg-core.js`,
            'text/javascript'
          ),
          wasmURL: await toBlobURL(
            `${FFMPEG_CORE_BASE_URL}/ffmpeg-core.wasm`,
            'application/wasm'
          ),
        })
        ffmpegRef.current = ffmpeg
        return ffmpeg
      } catch (error) {
        ffmpeg.terminate()
        throw error
      }
    })()

    loadPromiseRef.current = loadPromise
    try {
      return await loadPromise
    } finally {
      if (loadPromiseRef.current === loadPromise) {
        loadPromiseRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      jobIdRef.current += 1
      ffmpegRef.current?.terminate()
      ffmpegRef.current = null
      loadPromiseRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl)
    }
  }, [resultUrl])

  useEffect(() => {
    setResult(null)
    setResultUrl('')
    setPhase((current) => (current === 'complete' ? 'ready' : current))
  }, [settings])

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.playbackRate = speed
    }
  }, [previewUrl, speed])

  const resetOptionState = useCallback(() => {
    setTrimRange([0, 0])
    setCrop(FULL_CROP)
    setSpeed(1)
    setScale(100)
    setFormat('mp4')
    setVideoBitrateKbps(2500)
    setMp4FrameRate('source')
    setMp4Preset('veryfast')
    setIncludeAudio(true)
    setAudioBitrateKbps(128)
    setGifFps(15)
    setGifColors(256)
    setGifDither('bayer')
    setGifLoopForever(true)
    setWebpFps(20)
    setWebpQuality(75)
    setWebpCompressionLevel(4)
    setWebpLossless(false)
    setWebpLoopForever(true)
  }, [])

  const clearCurrentSource = useCallback(() => {
    jobIdRef.current += 1
    previewRef.current?.pause()
    setIsPlaying(false)
    setCurrentTime(0)
    setSourceFile(null)
    setMetadata(null)
    setPreviewUrl('')
    setResult(null)
    setResultUrl('')
    setProgress(0)
    setErrorMessage('')
    setPhase('idle')
    setUploadKey((value) => value + 1)
    resetOptionState()

    const inputName = inputNameRef.current
    inputNameRef.current = ''
    if (inputName && ffmpegRef.current?.loaded) {
      void safeDelete(ffmpegRef.current, inputName)
    }
  }, [resetOptionState])

  const handleSourceFile = useCallback(
    async (selected: File | null) => {
      if (!selected) return

      const sourceKind = getSourceKind(selected)
      if (!sourceKind) {
        setErrorMessage(t('common.tools.mp4GifStudio.page.errors.invalidFile'))
        return
      }
      if (selected.size > MAX_SOURCE_BYTES) {
        setErrorMessage(
          t('common.tools.mp4GifStudio.page.errors.fileTooLarge').replace(
            '{size}',
            formatStudioBytes(MAX_SOURCE_BYTES)
          )
        )
        return
      }

      const jobId = ++jobIdRef.current
      const previousInputName = inputNameRef.current
      inputNameRef.current = ''
      setSourceFile(selected)
      setMetadata(null)
      setResult(null)
      setResultUrl('')
      setErrorMessage('')
      setProgress(0)
      setCurrentTime(0)
      setIsPlaying(false)
      resetOptionState()

      const immediatePreviewUrl = URL.createObjectURL(selected)
      setPreviewUrl(immediatePreviewUrl)
      setPreviewKind(sourceKind === 'mp4' ? 'video' : 'image')

      const inputName = `studio-source-${jobId}.${sourceKind}`
      const probeName = `studio-probe-${jobId}.json`
      let ffmpeg: FFmpeg | null = null

      try {
        ffmpeg = await ensureFfmpeg()
        if (jobId !== jobIdRef.current) return

        if (previousInputName) {
          await safeDelete(ffmpeg, previousInputName)
        }

        setPhase('analyzing')
        await ffmpeg.writeFile(inputName, await fetchFile(selected))
        inputNameRef.current = inputName

        const probeLogs: string[] = []
        const probeLogHandler: LogEventCallback = ({ message }) => {
          probeLogs.push(message)
          if (probeLogs.length > 20) probeLogs.shift()
        }
        ffmpeg.on('log', probeLogHandler)
        let probeExitCode: number
        try {
          probeExitCode = await ffmpeg.ffprobe(
            buildStudioProbeCommand(inputName, probeName)
          )
        } finally {
          ffmpeg.off('log', probeLogHandler)
        }
        let nextMetadata: StudioMediaMetadata
        try {
          const rawProbe = await ffmpeg.readFile(probeName, 'utf8')
          nextMetadata = parseStudioProbe(String(rawProbe))
        } catch {
          throw new Error(
            `FFprobe exited with code ${probeExitCode}: ${probeLogs.slice(-4).join(' | ')}`
          )
        }
        if (jobId !== jobIdRef.current) return

        setMetadata(nextMetadata)
        setTrimRange([0, nextMetadata.duration])

        if (sourceKind === 'gif') {
          setPhase('preparingPreview')
          const proxyName = `studio-preview-${jobId}.mp4`
          try {
            const proxyExitCode = await ffmpeg.exec(
              buildGifPreviewCommand(nextMetadata, inputName, proxyName)
            )
            if (proxyExitCode === 0 && jobId === jobIdRef.current) {
              const proxyData = await ffmpeg.readFile(proxyName)
              if (typeof proxyData !== 'string') {
                const proxyBlob = new Blob([proxyData], { type: 'video/mp4' })
                setPreviewUrl(URL.createObjectURL(proxyBlob))
                setPreviewKind('video')
              }
            }
          } finally {
            await safeDelete(ffmpeg, proxyName)
          }
        }

        if (jobId === jobIdRef.current) {
          setPhase('ready')
        }
      } catch (error) {
        console.error(error)
        if (jobId === jobIdRef.current) {
          inputNameRef.current = ''
          setSourceFile(null)
          setMetadata(null)
          setPreviewUrl('')
          setPhase('idle')
          setUploadKey((value) => value + 1)
          setErrorMessage(
            t('common.tools.mp4GifStudio.page.errors.analysisFailed')
          )
        }
        if (ffmpeg) await safeDelete(ffmpeg, inputName)
      } finally {
        if (ffmpeg) await safeDelete(ffmpeg, probeName)
      }
    },
    [ensureFfmpeg, resetOptionState, t]
  )

  const handleTrimChange = useCallback(
    (nextRange: [number, number], movedEndpoint: TimeRangeEndpoint) => {
      setTrimRange(nextRange)
      const preview = previewRef.current
      if (!preview) return

      const seekTime = movedEndpoint === 'start' ? nextRange[0] : nextRange[1]
      preview.pause()
      preview.currentTime = seekTime
      setCurrentTime(seekTime)
      setIsPlaying(false)
    },
    []
  )

  const togglePlayback = useCallback(async () => {
    const preview = previewRef.current
    if (!preview) return

    if (!preview.paused) {
      preview.pause()
      setIsPlaying(false)
      return
    }

    if (
      preview.currentTime < trimRange[0] ||
      preview.currentTime >= trimRange[1]
    ) {
      preview.currentTime = trimRange[0]
      setCurrentTime(trimRange[0])
    }

    try {
      await preview.play()
      setIsPlaying(true)
    } catch {
      setIsPlaying(false)
    }
  }, [trimRange])

  const handlePreviewTimeUpdate = useCallback(() => {
    const preview = previewRef.current
    if (!preview) return

    if (preview.currentTime >= trimRange[1]) {
      preview.pause()
      preview.currentTime = trimRange[0]
      setCurrentTime(trimRange[0])
      setIsPlaying(false)
      return
    }
    setCurrentTime(preview.currentTime)
  }, [trimRange])

  const updateCropField = useCallback(
    (field: keyof CropRect, rawValue: number) => {
      if (!Number.isFinite(rawValue)) return
      setCrop((current) => {
        if (field === 'x') {
          return { ...current, x: clamp(rawValue, 0, 100 - current.width) }
        }
        if (field === 'y') {
          return { ...current, y: clamp(rawValue, 0, 100 - current.height) }
        }
        if (field === 'width') {
          return { ...current, width: clamp(rawValue, 5, 100 - current.x) }
        }
        return { ...current, height: clamp(rawValue, 5, 100 - current.y) }
      })
    },
    []
  )

  const handleFormatChange = useCallback((value: string) => {
    if (value === 'mp4' || value === 'gif' || value === 'webp') {
      setFormat(value)
    }
  }, [])

  const handleExport = useCallback(async () => {
    if (!sourceFile || !metadata || !inputNameRef.current || isExporting) return

    const outputName = `studio-output-${++jobIdRef.current}.${format}`
    const snapshot = settings
    let ffmpeg: FFmpeg | null = null
    let progressHandler: ProgressEventCallback | null = null

    setResult(null)
    setResultUrl('')
    setErrorMessage('')
    setProgress(0)
    setPhase('exporting')

    try {
      ffmpeg = await ensureFfmpeg()
      const plan = buildStudioExportPlan(
        metadata,
        snapshot,
        inputNameRef.current,
        outputName
      )

      progressHandler = ({ progress: nextProgress }) => {
        if (!Number.isFinite(nextProgress)) return
        const nextPercent = clamp(Math.round(nextProgress * 100), 0, 95)
        setProgress((current) => Math.max(current, nextPercent))
      }
      ffmpeg.on('progress', progressHandler)

      await safeDelete(ffmpeg, outputName)
      const exitCode = await ffmpeg.exec(plan.args)
      if (exitCode !== 0) {
        throw new Error(`FFmpeg exited with code ${exitCode}`)
      }

      const outputData = await ffmpeg.readFile(outputName)
      if (typeof outputData === 'string' || outputData.byteLength === 0) {
        throw new Error('FFmpeg returned an empty output')
      }

      const outputBlob = new Blob([outputData], {
        type: getOutputMimeType(format),
      })
      const fileName = `${getBaseName(sourceFile.name)}-edited.${format}`
      setResultUrl(URL.createObjectURL(outputBlob))
      setResult({ plan, fileName, size: outputBlob.size })
      setProgress(100)
      setPhase('complete')
    } catch (error) {
      console.error(error)
      setProgress(0)
      setPhase('ready')
      setErrorMessage(t('common.tools.mp4GifStudio.page.errors.exportFailed'))
    } finally {
      if (ffmpeg && progressHandler) {
        ffmpeg.off('progress', progressHandler)
      }
      if (ffmpeg) await safeDelete(ffmpeg, outputName)
    }
  }, [
    ensureFfmpeg,
    format,
    isExporting,
    metadata,
    settings,
    sourceFile,
    t,
  ])

  const stageStyle = useMemo<CSSProperties | undefined>(() => {
    if (!metadata) return undefined
    const aspectRatio = metadata.width / metadata.height
    return {
      aspectRatio: `${metadata.width} / ${metadata.height}`,
      width: `min(100%, calc(58vh * ${aspectRatio}))`,
    }
  }, [metadata])

  return (
    <UtilsLayout
      title={t('common.tools.mp4GifStudio.title')}
      description={t('common.tools.mp4GifStudio.description')}
    >
      <div className="mx-auto max-w-7xl space-y-5">
        <Card>
          <CardContent className="p-5">
            <FileUploadButton
              key={uploadKey}
              id={UPLOAD_ID}
              accept=".mp4,.gif,video/mp4,image/gif"
              onFileSelect={(file) => void handleSourceFile(file)}
              label={t('common.tools.mp4GifStudio.page.upload')}
              disabled={isBusy}
              className={sourceFile ? 'hidden' : undefined}
            />

            {!sourceFile && (
              <div className="mt-4 grid gap-2 text-center text-sm text-muted-foreground sm:grid-cols-2">
                <p>{t('common.tools.mp4GifStudio.page.supportedFormats')}</p>
                <p>{t('common.tools.mp4GifStudio.page.privacy')}</p>
              </div>
            )}

            {sourceFile && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <FileVideo2 className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{sourceFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatStudioBytes(sourceFile.size)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => document.getElementById(UPLOAD_ID)?.click()}
                  >
                    {t('common.tools.mp4GifStudio.page.replace')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isBusy}
                    onClick={clearCurrentSource}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('common.tools.mp4GifStudio.page.startOver')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>{t('common.tools.mp4GifStudio.title')}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {phaseText && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-lg border bg-muted/30 px-4 py-3"
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              {isBusy && (
                <LoaderCircle
                  className="h-4 w-4 animate-spin text-primary"
                  aria-hidden="true"
                />
              )}
              <span>{phaseText}</span>
              {isExporting && (
                <span className="ml-auto font-mono tabular-nums">{progress}%</span>
              )}
            </div>
            {isExporting && (
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {sourceFile && metadata && (
          <div
            className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]"
            aria-busy={isExporting}
          >
            <div className="min-w-0 space-y-5">
              <Card role="region" aria-labelledby="studio-preview-heading">
                <CardHeader className="pb-4">
                  <CardTitle id="studio-preview-heading" className="flex items-center gap-2 text-lg">
                    <Crop className="h-5 w-5" aria-hidden="true" />
                    {t('common.tools.mp4GifStudio.page.editor.preview')}
                  </CardTitle>
                  <CardDescription>
                    {t('common.tools.mp4GifStudio.page.crop.hint')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-xl bg-zinc-950 p-3 sm:p-5">
                    <div className="mx-auto max-w-full" style={stageStyle}>
                      <CropOverlay
                        value={crop}
                        onChange={setCrop}
                        labels={cropLabels}
                        disabled={isExporting}
                      >
                        {previewKind === 'video' ? (
                          <video
                            ref={previewRef}
                            src={previewUrl}
                            aria-label={t('common.tools.mp4GifStudio.page.editor.preview')}
                            className="h-full w-full object-contain"
                            playsInline
                            preload="metadata"
                            onLoadedMetadata={(event) => {
                              event.currentTarget.currentTime = trimRange[0]
                              event.currentTarget.playbackRate = speed
                            }}
                            onTimeUpdate={handlePreviewTimeUpdate}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewUrl}
                            alt={t('common.tools.mp4GifStudio.page.editor.preview')}
                            className="h-full w-full object-contain"
                          />
                        )}
                      </CropOverlay>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void togglePlayback()}
                      disabled={isExporting || previewKind !== 'video'}
                      aria-label={
                        isPlaying
                          ? t('common.tools.mp4GifStudio.page.editor.pause')
                          : t('common.tools.mp4GifStudio.page.editor.play')
                      }
                    >
                      {isPlaying ? (
                        <Pause className="mr-2 h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                      )}
                      {isPlaying
                        ? t('common.tools.mp4GifStudio.page.editor.pause')
                        : t('common.tools.mp4GifStudio.page.editor.play')}
                    </Button>
                    <span className="font-mono text-sm tabular-nums text-muted-foreground">
                      {formatStudioTime(currentTime)} / {formatStudioTime(metadata.duration)}
                    </span>
                    {outputGeometry && (
                      <span className="ml-auto text-sm text-muted-foreground">
                        {t('common.tools.mp4GifStudio.page.editor.outputDimensions')}:{' '}
                        <strong className="text-foreground">
                          {outputGeometry.width} × {outputGeometry.height}
                        </strong>
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card role="region" aria-labelledby="studio-timeline-heading">
                <CardHeader className="pb-4">
                  <CardTitle id="studio-timeline-heading" className="flex items-center gap-2 text-lg">
                    <Scissors className="h-5 w-5" aria-hidden="true" />
                    {t('common.tools.mp4GifStudio.page.editor.timeline')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeRangeControl
                    duration={metadata.duration}
                    value={trimRange}
                    onChange={handleTrimChange}
                    disabled={isExporting}
                    labels={{
                      range: t('common.tools.mp4GifStudio.page.editor.timeline'),
                      start: t('common.tools.mp4GifStudio.page.editor.startTime'),
                      end: t('common.tools.mp4GifStudio.page.editor.endTime'),
                      selection: t('common.tools.mp4GifStudio.page.editor.selectedDuration'),
                    }}
                  />
                </CardContent>
              </Card>

              <Card role="region" aria-labelledby="studio-source-heading">
                <CardHeader className="pb-4">
                  <CardTitle id="studio-source-heading" className="text-lg">
                    {t('common.tools.mp4GifStudio.page.source.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-muted-foreground">
                        {t('common.tools.mp4GifStudio.page.source.fileSize')}
                      </dt>
                      <dd className="mt-1 font-medium">{formatStudioBytes(sourceFile.size)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        {t('common.tools.mp4GifStudio.page.source.resolution')}
                      </dt>
                      <dd className="mt-1 font-medium">
                        {metadata.width} × {metadata.height}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        {t('common.tools.mp4GifStudio.page.source.duration')}
                      </dt>
                      <dd className="mt-1 font-medium">{formatStudioTime(metadata.duration)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        {t('common.tools.mp4GifStudio.page.source.frameRate')}
                      </dt>
                      <dd className="mt-1 font-medium">{metadata.fps.toFixed(2)} FPS</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">
                        {t('common.tools.mp4GifStudio.page.source.audio')}
                      </dt>
                      <dd className="mt-1 font-medium">
                        {metadata.hasAudio
                          ? t('common.tools.mp4GifStudio.page.source.yes')
                          : t('common.tools.mp4GifStudio.page.source.no')}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>

            <aside className="min-w-0 space-y-5 lg:sticky lg:top-5 lg:self-start">
              <Card role="region" aria-labelledby="studio-edit-heading">
                <CardHeader className="pb-4">
                  <CardTitle id="studio-edit-heading" className="flex items-center gap-2 text-lg">
                    <Settings2 className="h-5 w-5" aria-hidden="true" />
                    {t('common.tools.mp4GifStudio.page.editor.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="studio-speed">
                        {t('common.tools.mp4GifStudio.page.editor.speed')}
                      </Label>
                      <span className="font-mono text-sm font-medium tabular-nums">{speed.toFixed(2)}×</span>
                    </div>
                    <input
                      id="studio-speed"
                      type="range"
                      min={0.25}
                      max={4}
                      step={0.25}
                      value={speed}
                      disabled={isExporting}
                      onChange={(event) => setSpeed(event.currentTarget.valueAsNumber)}
                      className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="studio-scale">
                        {t('common.tools.mp4GifStudio.page.editor.outputScale')}
                      </Label>
                      <span className="font-mono text-sm font-medium tabular-nums">{scale}%</span>
                    </div>
                    <input
                      id="studio-scale"
                      type="range"
                      min={25}
                      max={100}
                      step={5}
                      value={scale}
                      disabled={isExporting}
                      onChange={(event) => setScale(event.currentTarget.valueAsNumber)}
                      className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-3 border-t pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium">
                        {t('common.tools.mp4GifStudio.page.crop.title')}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isExporting}
                        onClick={() => setCrop(FULL_CROP)}
                      >
                        {t('common.tools.mp4GifStudio.page.crop.reset')}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {(['x', 'y', 'width', 'height'] as const).map((field) => (
                        <div key={field} className="space-y-1.5">
                          <Label htmlFor={`studio-crop-${field}`}>
                            {t(`common.tools.mp4GifStudio.page.crop.${field}`)} (%)
                          </Label>
                          <Input
                            id={`studio-crop-${field}`}
                            type="number"
                            min={field === 'width' || field === 'height' ? 5 : 0}
                            max={100}
                            step={0.1}
                            value={Number(crop[field].toFixed(1))}
                            disabled={isExporting}
                            onChange={(event) =>
                              updateCropField(field, event.currentTarget.valueAsNumber)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card role="region" aria-labelledby="studio-export-heading">
                <CardHeader className="pb-4">
                  <CardTitle id="studio-export-heading" className="flex items-center gap-2 text-lg">
                    <Gauge className="h-5 w-5" aria-hidden="true" />
                    {t('common.tools.mp4GifStudio.page.export.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <fieldset disabled={isExporting} className="space-y-2">
                    <legend className="mb-2 text-sm font-medium">
                      {t('common.tools.mp4GifStudio.page.export.outputFormat')}
                    </legend>
                    <RadioGroup
                      value={format}
                      onValueChange={handleFormatChange}
                      className="grid grid-cols-3 gap-2"
                      aria-label={t('common.tools.mp4GifStudio.page.export.outputFormat')}
                    >
                      {(['mp4', 'gif', 'webp'] as const).map((option) => (
                        <Label
                          key={option}
                          htmlFor={`studio-format-${option}`}
                          className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-2 py-2.5 text-sm font-semibold transition-colors ${
                            format === option
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <RadioGroupItem
                            id={`studio-format-${option}`}
                            value={option}
                            className="sr-only"
                          />
                          {option.toUpperCase()}
                        </Label>
                      ))}
                    </RadioGroup>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {t(`common.tools.mp4GifStudio.page.export.${format}Description`)}
                    </p>
                  </fieldset>

                  {format === 'mp4' && (
                    <div className="space-y-5 border-t pt-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor="studio-video-bitrate">
                            {t('common.tools.mp4GifStudio.page.export.videoBitrate')}
                          </Label>
                          <span className="font-mono text-sm tabular-nums">{videoBitrateKbps} kbps</span>
                        </div>
                        <input
                          id="studio-video-bitrate"
                          type="range"
                          min={250}
                          max={12000}
                          step={250}
                          value={videoBitrateKbps}
                          disabled={isExporting}
                          onChange={(event) => setVideoBitrateKbps(event.currentTarget.valueAsNumber)}
                          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="studio-mp4-fps">
                          {t('common.tools.mp4GifStudio.page.export.frameRate')}
                        </Label>
                        <Select
                          value={String(mp4FrameRate)}
                          onValueChange={(value) =>
                            setMp4FrameRate(
                              value === 'source' ? 'source' : (Number(value) as 24 | 30 | 60)
                            )
                          }
                          disabled={isExporting}
                        >
                          <SelectTrigger id="studio-mp4-fps">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="source">
                              {t('common.tools.mp4GifStudio.page.export.sourceFrameRate')}
                            </SelectItem>
                            <SelectItem value="24">24 FPS</SelectItem>
                            <SelectItem value="30">30 FPS</SelectItem>
                            <SelectItem value="60">60 FPS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="studio-preset">
                          {t('common.tools.mp4GifStudio.page.export.encodingPreset')}
                        </Label>
                        <Select
                          value={mp4Preset}
                          onValueChange={(value) =>
                            setMp4Preset(value as 'ultrafast' | 'veryfast' | 'medium')
                          }
                          disabled={isExporting}
                        >
                          <SelectTrigger id="studio-preset">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ultrafast">
                              {t('common.tools.mp4GifStudio.page.export.presetUltrafast')}
                            </SelectItem>
                            <SelectItem value="veryfast">
                              {t('common.tools.mp4GifStudio.page.export.presetVeryfast')}
                            </SelectItem>
                            <SelectItem value="medium">
                              {t('common.tools.mp4GifStudio.page.export.presetMedium')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="studio-include-audio"
                          checked={includeAudio && metadata.hasAudio}
                          disabled={isExporting || !metadata.hasAudio}
                          onCheckedChange={(checked) => setIncludeAudio(checked === true)}
                        />
                        <Label htmlFor="studio-include-audio" className="cursor-pointer">
                          {t('common.tools.mp4GifStudio.page.export.includeAudio')}
                        </Label>
                      </div>

                      {includeAudio && metadata.hasAudio && (
                        <div className="space-y-1.5">
                          <Label htmlFor="studio-audio-bitrate">
                            {t('common.tools.mp4GifStudio.page.export.audioBitrate')}
                          </Label>
                          <Select
                            value={String(audioBitrateKbps)}
                            onValueChange={(value) => setAudioBitrateKbps(Number(value))}
                            disabled={isExporting}
                          >
                            <SelectTrigger id="studio-audio-bitrate">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[64, 96, 128, 192, 256].map((bitrate) => (
                                <SelectItem key={bitrate} value={String(bitrate)}>
                                  {bitrate} kbps
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {estimatedMp4Size > 0 && (
                        <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                          {t('common.tools.mp4GifStudio.page.export.estimatedSize')}:{' '}
                          <strong>{formatStudioBytes(estimatedMp4Size)}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {format === 'gif' && (
                    <div className="space-y-5 border-t pt-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor="studio-gif-fps">
                            {t('common.tools.mp4GifStudio.page.export.frameRate')}
                          </Label>
                          <span className="font-mono text-sm tabular-nums">{gifFps} FPS</span>
                        </div>
                        <input
                          id="studio-gif-fps"
                          type="range"
                          min={5}
                          max={30}
                          step={1}
                          value={gifFps}
                          disabled={isExporting}
                          onChange={(event) => setGifFps(event.currentTarget.valueAsNumber)}
                          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor="studio-gif-colors">
                            {t('common.tools.mp4GifStudio.page.export.colorCount')}
                          </Label>
                          <span className="font-mono text-sm tabular-nums">{gifColors}</span>
                        </div>
                        <input
                          id="studio-gif-colors"
                          type="range"
                          min={32}
                          max={256}
                          step={16}
                          value={gifColors}
                          disabled={isExporting}
                          onChange={(event) => setGifColors(event.currentTarget.valueAsNumber)}
                          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="studio-gif-dither">
                          {t('common.tools.mp4GifStudio.page.export.dithering')}
                        </Label>
                        <Select
                          value={gifDither}
                          onValueChange={(value) =>
                            setGifDither(
                              value as 'none' | 'bayer' | 'floyd_steinberg' | 'sierra2_4a'
                            )
                          }
                          disabled={isExporting}
                        >
                          <SelectTrigger id="studio-gif-dither">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              {t('common.tools.mp4GifStudio.page.export.ditherNone')}
                            </SelectItem>
                            <SelectItem value="bayer">
                              {t('common.tools.mp4GifStudio.page.export.ditherBayer')}
                            </SelectItem>
                            <SelectItem value="floyd_steinberg">
                              {t('common.tools.mp4GifStudio.page.export.ditherFloydSteinberg')}
                            </SelectItem>
                            <SelectItem value="sierra2_4a">
                              {t('common.tools.mp4GifStudio.page.export.ditherSierra2_4a')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="studio-gif-loop"
                          checked={gifLoopForever}
                          disabled={isExporting}
                          onCheckedChange={(checked) => setGifLoopForever(checked === true)}
                        />
                        <Label htmlFor="studio-gif-loop" className="cursor-pointer">
                          {t('common.tools.mp4GifStudio.page.export.loopForever')}
                        </Label>
                      </div>
                    </div>
                  )}

                  {format === 'webp' && (
                    <div className="space-y-5 border-t pt-5">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor="studio-webp-fps">
                            {t('common.tools.mp4GifStudio.page.export.frameRate')}
                          </Label>
                          <span className="font-mono text-sm tabular-nums">{webpFps} FPS</span>
                        </div>
                        <input
                          id="studio-webp-fps"
                          type="range"
                          min={5}
                          max={30}
                          step={1}
                          value={webpFps}
                          disabled={isExporting}
                          onChange={(event) => setWebpFps(event.currentTarget.valueAsNumber)}
                          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor="studio-webp-quality">
                            {t('common.tools.mp4GifStudio.page.export.webpQuality')}
                          </Label>
                          <span className="font-mono text-sm tabular-nums">{webpQuality}</span>
                        </div>
                        <input
                          id="studio-webp-quality"
                          type="range"
                          min={10}
                          max={100}
                          step={5}
                          value={webpQuality}
                          disabled={isExporting}
                          onChange={(event) => setWebpQuality(event.currentTarget.valueAsNumber)}
                          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <Label htmlFor="studio-webp-compression">
                            {t('common.tools.mp4GifStudio.page.export.compressionLevel')}
                          </Label>
                          <span className="font-mono text-sm tabular-nums">{webpCompressionLevel}</span>
                        </div>
                        <input
                          id="studio-webp-compression"
                          type="range"
                          min={0}
                          max={6}
                          step={1}
                          value={webpCompressionLevel}
                          disabled={isExporting}
                          onChange={(event) =>
                            setWebpCompressionLevel(event.currentTarget.valueAsNumber)
                          }
                          className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="studio-webp-lossless"
                          checked={webpLossless}
                          disabled={isExporting}
                          onCheckedChange={(checked) => setWebpLossless(checked === true)}
                        />
                        <Label htmlFor="studio-webp-lossless" className="cursor-pointer">
                          {t('common.tools.mp4GifStudio.page.export.lossless')}
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="studio-webp-loop"
                          checked={webpLoopForever}
                          disabled={isExporting}
                          onCheckedChange={(checked) => setWebpLoopForever(checked === true)}
                        />
                        <Label htmlFor="studio-webp-loop" className="cursor-pointer">
                          {t('common.tools.mp4GifStudio.page.export.loopForever')}
                        </Label>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    className="w-full"
                    size="lg"
                    disabled={isExporting || !outputGeometry}
                    onClick={() => void handleExport()}
                  >
                    {isExporting && (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    )}
                    {t('common.tools.mp4GifStudio.page.export.exportButton')} {format.toUpperCase()}
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}

        {result && resultUrl && (
          <Card role="region" aria-labelledby="studio-result-heading">
            <CardHeader>
              <CardTitle id="studio-result-heading">
                {t('common.tools.mp4GifStudio.page.result.title')}
              </CardTitle>
              <CardDescription>
                {result.plan.geometry.width} × {result.plan.geometry.height} ·{' '}
                {formatStudioTime(result.plan.effectiveDuration)} ·{' '}
                {formatStudioBytes(result.size)}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div className="overflow-hidden rounded-lg border bg-zinc-950 p-3">
                {result.plan.format === 'mp4' ? (
                  <video
                    src={resultUrl}
                    controls
                    playsInline
                    aria-label={t('common.tools.mp4GifStudio.page.result.previewAlt')}
                    className="mx-auto max-h-[480px] max-w-full"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resultUrl}
                    alt={t('common.tools.mp4GifStudio.page.result.previewAlt')}
                    className="mx-auto max-h-[480px] max-w-full"
                  />
                )}
              </div>
              <div className="space-y-3 md:min-w-48">
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <p className="text-muted-foreground">
                    {t('common.tools.mp4GifStudio.page.result.outputSize')}
                  </p>
                  <p className="mt-1 text-lg font-semibold">{formatStudioBytes(result.size)}</p>
                </div>
                <Button asChild className="w-full">
                  <a href={resultUrl} download={result.fileName}>
                    <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t('common.tools.mp4GifStudio.page.result.download')}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </UtilsLayout>
  )
}
