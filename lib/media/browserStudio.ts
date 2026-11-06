/**
 * Browser-native media pipeline for the MP4, GIF Studio.
 *
 * Uses WebCodecs (through Mediabunny for demuxing/muxing, and ImageDecoder for GIF/WebP) so the
 * browser's hardware-accelerated decoders and encoders handle the work when they are available.
 * Every entry point either succeeds or throws; callers are expected to fall back to FFmpeg.wasm.
 */
import type {
  Conversion,
  ConversionVideoOptions,
  InputAudioTrack,
  InputVideoTrack,
  Quality,
  VideoCodec,
  VideoSample,
} from 'mediabunny'

import {
  buildStudioMp4TranscodePlan,
  estimateCrfBitrateKbps,
} from './mp4GifStudio'
import type {
  StudioMediaMetadata,
  StudioMp4TranscodePlan,
  StudioSettings,
} from './mp4GifStudio'

type Mediabunny = typeof import('mediabunny')

export type BrowserImageFrame = {
  start: number
  duration: number
}

export type BrowserStudioSource =
  | {
      kind: 'container'
      file: Blob
      /** Timestamp (seconds) that the studio timeline treats as 0. */
      timeOffset: number
      metadata: StudioMediaMetadata
    }
  | {
      kind: 'image'
      file: Blob
      mimeType: string
      frames: BrowserImageFrame[]
      metadata: StudioMediaMetadata
    }

export type BrowserExportResult = {
  blob: Blob
  hardwareAccelerated: boolean
  plan: StudioMp4TranscodePlan
}

type HardwareAcceleration = 'no-preference' | 'prefer-hardware'

type PreviewTarget = {
  codec: VideoCodec
  container: 'mp4' | 'webm'
}

/** Thrown when the browser cannot handle a job; the caller should fall back to FFmpeg. */
export class BrowserStudioUnsupportedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BrowserStudioUnsupportedError'
  }
}

export class BrowserStudioAbortError extends Error {
  constructor() {
    super('Browser media job was aborted')
    this.name = 'BrowserStudioAbortError'
  }
}

const EXPORT_VIDEO_CODEC: VideoCodec = 'avc'
const EXPORT_AUDIO_CODEC = 'aac'
const PREVIEW_MAX_DIMENSION = 960
const PREVIEW_BITRATE = 1_500_000
const STILL_DURATION_SEC = 1
const MIN_WEBP_FRAME_DURATION_SEC = 0.01
// Matches FFmpeg's GIF demuxer defaults (min_delay=2cs, default_delay=10cs) and browser playback.
const MIN_GIF_FRAME_DURATION_SEC = 0.02
const DEFAULT_GIF_FRAME_DURATION_SEC = 0.1

const PREVIEW_TARGETS: Array<PreviewTarget & { playType: string }> = [
  { codec: 'avc', container: 'mp4', playType: 'video/mp4; codecs="avc1.42E01E"' },
  { codec: 'vp9', container: 'webm', playType: 'video/webm; codecs="vp9"' },
  { codec: 'vp8', container: 'webm', playType: 'video/webm; codecs="vp8"' },
  { codec: 'av1', container: 'webm', playType: 'video/webm; codecs="av01.0.05M.08"' },
]

let mediabunnyPromise: Promise<Mediabunny> | null = null

function loadMediabunny(): Promise<Mediabunny> {
  if (!mediabunnyPromise) {
    mediabunnyPromise = import('mediabunny').catch((error: unknown) => {
      mediabunnyPromise = null
      throw error
    })
  }
  return mediabunnyPromise
}

/** True when the browser exposes the WebCodecs classes the studio needs for video work. */
export function hasWebCodecsVideoSupport(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof VideoEncoder === 'function' &&
    typeof VideoDecoder === 'function' &&
    typeof VideoFrame === 'function'
  )
}

function hasImageDecoderSupport(): boolean {
  return typeof window !== 'undefined' && typeof ImageDecoder === 'function'
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new BrowserStudioAbortError()
}

function toEven(value: number) {
  return Math.max(2, Math.floor(value / 2) * 2)
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

/**
 * Reads studio metadata with browser APIs only (no FFmpeg download).
 * Returns `null` when the browser cannot read the file.
 */
export async function probeBrowserStudioSource(
  file: File,
  kind: 'container' | 'image',
  signal?: AbortSignal
): Promise<BrowserStudioSource | null> {
  if (kind === 'image') {
    return probeImageSource(file, signal)
  }
  return probeContainerSource(file, signal)
}

async function probeContainerSource(
  file: File,
  signal?: AbortSignal
): Promise<BrowserStudioSource | null> {
  const mb = await loadMediabunny()
  throwIfAborted(signal)
  const input = new mb.Input({ source: new mb.BlobSource(file), formats: mb.ALL_FORMATS })

  try {
    if (!(await input.canRead())) return null

    const videoTrack = await input.getPrimaryVideoTrack()
    if (!videoTrack) return null
    const audioTrack = await input.getPrimaryAudioTrack()
    const tracks = await input.getTracks()
    throwIfAborted(signal)

    const timedTracks: Array<InputVideoTrack | InputAudioTrack> = audioTrack
      ? [videoTrack, audioTrack]
      : [videoTrack]
    const firstTimestamp = await input.getFirstTimestamp(timedTracks)
    const timeOffset = Number.isFinite(firstTimestamp) ? firstTimestamp : 0
    const videoEnd = await videoTrack.computeDuration()
    const duration = videoEnd - timeOffset
    const width = await videoTrack.getDisplayWidth()
    const height = await videoTrack.getDisplayHeight()
    const rotation = await videoTrack.getRotation()
    const stats = await videoTrack.computePacketStats(120)
    throwIfAborted(signal)

    const fps = stats.averagePacketRate
    if (
      !(width > 0) ||
      !(height > 0) ||
      !(duration > 0) ||
      !Number.isFinite(duration) ||
      !(fps > 0) ||
      !Number.isFinite(fps)
    ) {
      return null
    }

    const videoStreamIndex = tracks.indexOf(videoTrack)
    const audioStreamIndex = audioTrack ? tracks.indexOf(audioTrack) : -1

    return {
      kind: 'container',
      file,
      timeOffset,
      metadata: {
        width,
        height,
        duration,
        fps,
        hasAudio: audioStreamIndex >= 0,
        rotation,
        videoStreamIndex: Math.max(0, videoStreamIndex),
        audioStreamIndex: audioStreamIndex >= 0 ? audioStreamIndex : null,
      },
    }
  } finally {
    input.dispose()
  }
}

function getImageMimeType(file: File) {
  if (file.type === 'image/gif' || file.type === 'image/webp') return file.type
  return file.name.toLowerCase().endsWith('.gif') ? 'image/gif' : 'image/webp'
}

function normalizeImageFrameDuration(mimeType: string, durationMicros: number | null, frameCount: number) {
  if (frameCount === 1 && !(durationMicros && durationMicros > 0)) return STILL_DURATION_SEC

  const seconds = durationMicros && durationMicros > 0 ? durationMicros / 1_000_000 : 0
  if (mimeType === 'image/gif') {
    return seconds < MIN_GIF_FRAME_DURATION_SEC ? DEFAULT_GIF_FRAME_DURATION_SEC : seconds
  }
  return Math.max(MIN_WEBP_FRAME_DURATION_SEC, seconds)
}

async function openImageDecoder(file: Blob, mimeType: string) {
  const decoder = new ImageDecoder({ data: await file.arrayBuffer(), type: mimeType })
  await decoder.tracks.ready
  await decoder.completed
  return decoder
}

async function probeImageSource(
  file: File,
  signal?: AbortSignal
): Promise<BrowserStudioSource | null> {
  if (!hasImageDecoderSupport()) return null
  const mimeType = getImageMimeType(file)
  if (!(await ImageDecoder.isTypeSupported(mimeType))) return null

  const decoder = await openImageDecoder(file, mimeType)
  try {
    const frameCount = Math.max(1, decoder.tracks.selectedTrack?.frameCount ?? 1)
    const frames: BrowserImageFrame[] = []
    let width = 0
    let height = 0
    let cursor = 0

    for (let index = 0; index < frameCount; index += 1) {
      throwIfAborted(signal)
      const { image } = await decoder.decode({ frameIndex: index })
      try {
        width = Math.max(width, image.displayWidth)
        height = Math.max(height, image.displayHeight)
        const duration = normalizeImageFrameDuration(mimeType, image.duration, frameCount)
        frames.push({ start: cursor, duration })
        cursor += duration
      } finally {
        image.close()
      }
    }

    if (frames.length === 0 || width < 1 || height < 1 || !(cursor > 0)) return null

    return {
      kind: 'image',
      file,
      mimeType,
      frames,
      metadata: {
        width,
        height,
        duration: cursor,
        fps: frames.length / cursor,
        hasAudio: false,
        rotation: 0,
        videoStreamIndex: 0,
        audioStreamIndex: null,
      },
    }
  } finally {
    decoder.close()
  }
}

async function pickPreviewTarget(
  mb: Mediabunny,
  width: number,
  height: number
): Promise<PreviewTarget | null> {
  const probe = document.createElement('video')
  for (const target of PREVIEW_TARGETS) {
    if (probe.canPlayType(target.playType) === '') continue
    if (await mb.canEncodeVideo(target.codec, { width, height, bitrate: PREVIEW_BITRATE })) {
      return target
    }
  }
  return null
}

function createOutput(mb: Mediabunny, container: 'mp4' | 'webm') {
  const format =
    container === 'mp4'
      ? new mb.Mp4OutputFormat({ fastStart: 'in-memory' })
      : new mb.WebMOutputFormat()
  return new mb.Output({ format, target: new mb.BufferTarget() })
}

function outputToBlob(output: { target: { buffer: ArrayBuffer | null } }, mimeType: string) {
  const buffer = output.target.buffer
  if (!buffer || buffer.byteLength === 0) {
    throw new Error('Browser encoder returned an empty output')
  }
  return new Blob([buffer], { type: mimeType })
}

/**
 * Builds a low-resolution, browser-playable preview of a source that the `<video>` element
 * cannot play directly (or of a GIF/WebP so that it gets a seekable timeline).
 */
export async function createBrowserPreviewProxy(
  source: BrowserStudioSource,
  signal?: AbortSignal
): Promise<Blob> {
  if (!hasWebCodecsVideoSupport()) {
    throw new BrowserStudioUnsupportedError('WebCodecs is not available')
  }

  const mb = await loadMediabunny()
  const { metadata } = source
  const ratio = Math.min(1, PREVIEW_MAX_DIMENSION / Math.max(metadata.width, metadata.height))
  const width = toEven(metadata.width * ratio)
  const height = toEven(metadata.height * ratio)
  const target = await pickPreviewTarget(mb, width, height)
  if (!target) {
    throw new BrowserStudioUnsupportedError('No browser encoder can produce a playable preview')
  }
  throwIfAborted(signal)

  const mimeType = target.container === 'mp4' ? 'video/mp4' : 'video/webm'
  const quality = new mb.Quality({ bitrate: PREVIEW_BITRATE })

  if (source.kind === 'image') {
    const output = createOutput(mb, target.container)
    await encodeImageFrames(mb, source, output, {
      codec: target.codec,
      quality,
      hardwareAcceleration: 'no-preference',
      trimStart: 0,
      trimEnd: metadata.duration,
      speed: 1,
      crop: null,
      width,
      height,
      frameRate: null,
      signal,
    })
    return outputToBlob(output, mimeType)
  }

  const output = createOutput(mb, target.container)
  await runContainerConversion(mb, source, output, {
    video: {
      codec: target.codec,
      width,
      height,
      fit: 'fill',
      quality,
      forceTranscode: true,
      allowTransformationMetadata: false,
    },
    includeAudio: false,
    audioBitrate: 0,
    trim: null,
    signal,
  })
  return outputToBlob(output, mimeType)
}

/**
 * Exports an MP4 (H.264, plus AAC audio when requested) with WebCodecs. Hardware acceleration is
 * requested first when the browser reports a hardware encoder for the output configuration.
 */
export async function exportMp4WithBrowser(
  source: BrowserStudioSource,
  settings: StudioSettings,
  options: { onProgress?: (progress: number) => void; signal?: AbortSignal } = {}
): Promise<BrowserExportResult> {
  if (!hasWebCodecsVideoSupport()) {
    throw new BrowserStudioUnsupportedError('WebCodecs is not available')
  }

  const mb = await loadMediabunny()
  const plan = buildStudioMp4TranscodePlan(source.metadata, settings)

  if (plan.includeAudio && plan.speed !== 1) {
    // WebCodecs has no pitch-preserving time stretch (FFmpeg's atempo); let FFmpeg handle it.
    throw new BrowserStudioUnsupportedError('Audio speed changes require FFmpeg')
  }
  if (plan.includeAudio && typeof AudioEncoder !== 'function') {
    throw new BrowserStudioUnsupportedError('AudioEncoder is not available')
  }

  const quality = buildVideoQuality(mb, plan, source.metadata.fps)
  const encodeCheck = {
    width: plan.geometry.width,
    height: plan.geometry.height,
    quality,
  }
  if (!(await mb.canEncodeVideo(EXPORT_VIDEO_CODEC, encodeCheck))) {
    throw new BrowserStudioUnsupportedError('The browser cannot encode H.264 at this size')
  }

  const prefersHardware = await mb.canEncodeVideo(EXPORT_VIDEO_CODEC, {
    ...encodeCheck,
    hardwareAcceleration: 'prefer-hardware',
  })
  const attempts: HardwareAcceleration[] = prefersHardware
    ? ['prefer-hardware', 'no-preference']
    : ['no-preference']

  let lastError: unknown = null
  for (const hardwareAcceleration of attempts) {
    throwIfAborted(options.signal)
    options.onProgress?.(0)
    try {
      const blob = await exportMp4Attempt(mb, source, plan, quality, hardwareAcceleration, options)
      return { blob, hardwareAccelerated: hardwareAcceleration === 'prefer-hardware', plan }
    } catch (error) {
      if (error instanceof BrowserStudioAbortError) throw error
      if (error instanceof BrowserStudioUnsupportedError && hardwareAcceleration === 'no-preference') {
        throw error
      }
      lastError = error
    }
  }

  throw lastError ?? new Error('Browser MP4 export failed')
}

function buildVideoQuality(mb: Mediabunny, plan: StudioMp4TranscodePlan, sourceFps: number): Quality {
  if (plan.rateControl === 'quality') {
    const outputFps = plan.frameRate ?? sourceFps * plan.speed
    return new mb.Quality({
      quantizer: plan.crf,
      // Used only when the encoder cannot do constant-quantizer rate control.
      bitrate: estimateCrfBitrateKbps(plan.geometry, outputFps, plan.crf) * 1000,
    })
  }
  return new mb.Quality({ bitrate: plan.videoBitrateKbps * 1000 })
}

async function exportMp4Attempt(
  mb: Mediabunny,
  source: BrowserStudioSource,
  plan: StudioMp4TranscodePlan,
  quality: Quality,
  hardwareAcceleration: HardwareAcceleration,
  options: { onProgress?: (progress: number) => void; signal?: AbortSignal }
): Promise<Blob> {
  const output = createOutput(mb, 'mp4')

  if (source.kind === 'image') {
    await encodeImageFrames(mb, source, output, {
      codec: EXPORT_VIDEO_CODEC,
      quality,
      hardwareAcceleration,
      trimStart: plan.trimStart,
      trimEnd: plan.trimEnd,
      speed: plan.speed,
      crop: plan.crop,
      width: plan.geometry.width,
      height: plan.geometry.height,
      frameRate: plan.frameRate,
      signal: options.signal,
      onProgress: options.onProgress,
    })
    return outputToBlob(output, 'video/mp4')
  }

  const { speed } = plan
  await runContainerConversion(mb, source, output, {
    video: {
      codec: EXPORT_VIDEO_CODEC,
      crop: plan.crop,
      width: plan.geometry.width,
      height: plan.geometry.height,
      fit: 'fill',
      // Frame-rate conversion runs on the input timeline, before the speed change below.
      frameRate: plan.frameRate === null ? undefined : plan.frameRate / speed,
      quality,
      hardwareAcceleration,
      forceTranscode: true,
      allowTransformationMetadata: false,
      process:
        speed === 1
          ? undefined
          : (sample: VideoSample) => {
              sample.setTimestamp(sample.timestamp / speed)
              sample.setDuration(sample.duration / speed)
              return sample
            },
    },
    includeAudio: plan.includeAudio,
    audioBitrate: plan.audioBitrateKbps * 1000,
    trim: {
      start: source.timeOffset + plan.trimStart,
      end: source.timeOffset + plan.trimEnd,
    },
    signal: options.signal,
    onProgress: options.onProgress,
  })
  return outputToBlob(output, 'video/mp4')
}

async function runContainerConversion(
  mb: Mediabunny,
  source: Extract<BrowserStudioSource, { kind: 'container' }>,
  output: InstanceType<Mediabunny['Output']>,
  options: {
    video: ConversionVideoOptions
    includeAudio: boolean
    audioBitrate: number
    trim: { start: number; end: number } | null
    signal?: AbortSignal
    onProgress?: (progress: number) => void
  }
) {
  const input = new mb.Input({ source: new mb.BlobSource(source.file), formats: mb.ALL_FORMATS })
  let conversion: Conversion | null = null
  const abort = () => {
    void conversion?.cancel()
  }

  try {
    const videoTrack = await input.getPrimaryVideoTrack()
    if (!videoTrack || !(await videoTrack.canDecode())) {
      throw new BrowserStudioUnsupportedError('The browser cannot decode this video track')
    }
    const audioTrack = options.includeAudio ? await input.getPrimaryAudioTrack() : null
    if (options.includeAudio && (!audioTrack || !(await audioTrack.canDecode()))) {
      throw new BrowserStudioUnsupportedError('The browser cannot decode this audio track')
    }

    conversion = await mb.Conversion.init({
      input,
      output,
      tracks: 'primary',
      copy: false,
      showWarnings: false,
      trim: options.trim ?? undefined,
      video: options.video,
      audio: options.includeAudio
        ? {
            codec: EXPORT_AUDIO_CODEC,
            quality: new mb.Quality({ bitrate: options.audioBitrate }),
            forceTranscode: true,
          }
        : { discard: true },
    })

    const blockingDiscard = conversion.discardedTracks.find(
      ({ track }) => track === videoTrack || (audioTrack !== null && track === audioTrack)
    )
    const usesVideo = conversion.utilizedTracks.includes(videoTrack)
    const usesAudio = audioTrack === null || conversion.utilizedTracks.includes(audioTrack)
    if (!conversion.isValid || blockingDiscard || !usesVideo || !usesAudio) {
      throw new BrowserStudioUnsupportedError(
        `Browser conversion is not possible (${blockingDiscard?.reason ?? 'invalid'})`
      )
    }

    if (options.onProgress) {
      const report = options.onProgress
      conversion.onProgress = (progress) => report(clamp(progress, 0, 1))
    }

    throwIfAborted(options.signal)
    options.signal?.addEventListener('abort', abort, { once: true })
    await conversion.execute()
  } catch (error) {
    if (options.signal?.aborted) throw new BrowserStudioAbortError()
    throw error
  } finally {
    options.signal?.removeEventListener('abort', abort)
    if (conversion?.state === 'executing' || conversion?.state === 'idle') {
      await conversion.cancel().catch(() => undefined)
    }
    input.dispose()
  }
}

async function encodeImageFrames(
  mb: Mediabunny,
  source: Extract<BrowserStudioSource, { kind: 'image' }>,
  output: InstanceType<Mediabunny['Output']>,
  options: {
    codec: VideoCodec
    quality: Quality
    hardwareAcceleration: HardwareAcceleration
    trimStart: number
    trimEnd: number
    speed: number
    crop: StudioMp4TranscodePlan['crop'] | null
    width: number
    height: number
    frameRate: number | null
    signal?: AbortSignal
    onProgress?: (progress: number) => void
  }
) {
  const { metadata, frames } = source
  const videoSource = new mb.VideoSampleSource({
    codec: options.codec,
    quality: options.quality,
    hardwareAcceleration: options.hardwareAcceleration,
    transform: {
      width: options.width,
      height: options.height,
      fit: 'fill',
      crop: options.crop ?? undefined,
      frameRate: options.frameRate ?? undefined,
    },
  })
  output.addVideoTrack(videoSource, options.frameRate ? { frameRate: options.frameRate } : {})

  const canvas = new OffscreenCanvas(metadata.width, metadata.height)
  const context = canvas.getContext('2d')
  if (!context) throw new BrowserStudioUnsupportedError('OffscreenCanvas 2D is not available')

  const decoder = await openImageDecoder(source.file, source.mimeType)
  let finished = false
  try {
    await output.start()
    const span = Math.max(options.trimEnd - options.trimStart, Number.EPSILON)

    for (let index = 0; index < frames.length; index += 1) {
      throwIfAborted(options.signal)
      const frame = frames[index]
      const start = Math.max(frame.start, options.trimStart)
      const end = Math.min(frame.start + frame.duration, options.trimEnd)
      if (frame.start >= options.trimEnd) break
      if (end <= start) continue

      const { image } = await decoder.decode({ frameIndex: index })
      try {
        // Transparent pixels become black, matching the FFmpeg path.
        context.fillStyle = '#000000'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(image, 0, 0)
      } finally {
        image.close()
      }

      const sample = new mb.VideoSample(canvas, {
        timestamp: (start - options.trimStart) / options.speed,
        duration: (end - start) / options.speed,
      })
      try {
        await videoSource.add(sample)
      } finally {
        sample.close()
      }
      options.onProgress?.(clamp((end - options.trimStart) / span, 0, 1))
    }

    videoSource.close()
    await output.finalize()
    finished = true
  } finally {
    decoder.close()
    if (!finished) {
      await output.cancel().catch(() => undefined)
    }
  }
}
