export const FFMPEG_CORE_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/umd";

export const MAX_SOURCE_BYTES = 100 * 1024 * 1024;
export const MAX_ESTIMATED_MEMORY_BYTES = 1024 * 1024 * 1024;

export type StudioOutputFormat = "mp4" | "gif" | "webp";
export type StudioMp4FrameRate = "source" | 24 | 30 | 60;
export type StudioMp4Preset = "ultrafast" | "veryfast" | "medium";
export type StudioGifDither = "none" | "bayer" | "floyd_steinberg" | "sierra2_4a";

export type StudioCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StudioMp4Options = {
  videoBitrateKbps: number;
  frameRate: StudioMp4FrameRate;
  preset: StudioMp4Preset;
  includeAudio: boolean;
  audioBitrateKbps: number;
};

export type StudioGifOptions = {
  fps: number;
  colors: number;
  dither: StudioGifDither;
  loopForever: boolean;
};

export type StudioWebpOptions = {
  fps: number;
  quality: number;
  compressionLevel: number;
  lossless: boolean;
  loopForever: boolean;
};

/** A complete editor snapshot. Options for inactive formats are retained. */
export type StudioSettings = {
  format: StudioOutputFormat;
  trimRange: [number, number];
  crop: StudioCrop;
  speed: number;
  scale: number;
  mp4: StudioMp4Options;
  gif: StudioGifOptions;
  webp: StudioWebpOptions;
};

/** Width and height are display-oriented (rotation has already been applied). */
export type StudioMediaMetadata = {
  width: number;
  height: number;
  duration: number;
  fps: number;
  hasAudio: boolean;
  rotation: number;
  videoStreamIndex: number;
  audioStreamIndex: number | null;
};

export type StudioOutputGeometry = {
  width: number;
  height: number;
};

export type StudioExportPlan = {
  args: string[];
  format: StudioOutputFormat;
  mimeType: "video/mp4" | "image/gif" | "image/webp";
  geometry: StudioOutputGeometry;
  effectiveDuration: number;
};

type ProbeStream = {
  index?: unknown;
  codec_type?: unknown;
  width?: unknown;
  height?: unknown;
  duration?: unknown;
  avg_frame_rate?: unknown;
  r_frame_rate?: unknown;
  tags?: { rotate?: unknown } | null;
  side_data_list?: Array<{ rotation?: unknown }> | null;
  disposition?: { attached_pic?: unknown } | null;
};

type ProbeDocument = {
  streams?: unknown;
  format?: { duration?: unknown } | null;
};

type NormalizedSnapshot = {
  format: StudioOutputFormat;
  trimStart: number;
  trimEnd: number;
  crop: StudioCrop;
  speed: number;
  scale: number;
  mp4: StudioMp4Options;
  gif: StudioGifOptions;
  webp: StudioWebpOptions;
};

type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type StudioTransform = {
  snapshot: NormalizedSnapshot;
  crop: PixelCrop;
  geometry: StudioOutputGeometry;
  effectiveDuration: number;
};

const MIN_CROP_PERCENT = 1;
const MIN_VIDEO_BITRATE_KBPS = 100;
const MAX_VIDEO_BITRATE_KBPS = 50_000;
const MIN_AUDIO_BITRATE_KBPS = 32;
const MAX_AUDIO_BITRATE_KBPS = 512;
const NUMBER_PRECISION = 6;

const MIME_TYPES: Record<StudioOutputFormat, StudioExportPlan["mimeType"]> = {
  mp4: "video/mp4",
  gif: "image/gif",
  webp: "image/webp",
};

export function buildStudioProbeCommand(input: string, output: string): string[] {
  return [
    "-v",
    "error",
    "-show_entries",
    "format=duration:stream=index,codec_type,width,height,duration,avg_frame_rate,r_frame_rate:stream_tags=rotate:stream_side_data=rotation:stream_disposition=attached_pic",
    "-of",
    "json",
    input,
    "-o",
    output,
  ];
}

export function parseStudioProbe(raw: string): StudioMediaMetadata {
  let document: ProbeDocument;

  try {
    document = JSON.parse(raw) as ProbeDocument;
  } catch {
    throw new Error("Unable to parse studio media metadata: ffprobe returned invalid JSON.");
  }

  if (!document || typeof document !== "object" || !Array.isArray(document.streams)) {
    throw new Error("Unable to parse studio media metadata: ffprobe did not return streams.");
  }

  const streams = document.streams.filter(isProbeStream);
  const videoStream = streams.find((stream) => {
    if (stream.codec_type !== "video" || isAttachedPicture(stream)) {
      return false;
    }

    return (
      readPositiveNumber(stream.width) !== null &&
      readPositiveNumber(stream.height) !== null &&
      readFrameRate(stream) !== null &&
      readStreamIndex(stream.index) !== null
    );
  });

  if (!videoStream) {
    throw new Error(
      "Unable to read studio media metadata: no usable video stream with positive dimensions and frame rate was found."
    );
  }

  const sourceWidth = readPositiveNumber(videoStream.width);
  const sourceHeight = readPositiveNumber(videoStream.height);
  const fps = readFrameRate(videoStream);
  const videoStreamIndex = readStreamIndex(videoStream.index);
  const streamDuration = readPositiveNumber(videoStream.duration);
  const formatDuration = readPositiveNumber(document.format?.duration);
  const duration = streamDuration ?? formatDuration;

  if (
    sourceWidth === null ||
    sourceHeight === null ||
    fps === null ||
    videoStreamIndex === null ||
    duration === null
  ) {
    throw new Error(
      "Unable to read studio media metadata: video dimensions, duration, and frame rate must be finite and greater than zero."
    );
  }

  const rotation = readRotation(videoStream);
  const swapsAxes = rotation === 90 || rotation === 270;
  const audioStream = streams.find(
    (stream) => stream.codec_type === "audio" && readStreamIndex(stream.index) !== null
  );
  const audioStreamIndex = audioStream ? readStreamIndex(audioStream.index) : null;

  return {
    width: swapsAxes ? sourceHeight : sourceWidth,
    height: swapsAxes ? sourceWidth : sourceHeight,
    duration,
    fps,
    hasAudio: audioStreamIndex !== null,
    rotation,
    videoStreamIndex,
    audioStreamIndex,
  };
}

export function buildStudioPreviewCommand(
  metadata: StudioMediaMetadata,
  input: string,
  output: string
): string[] {
  assertUsableMetadata(metadata);

  const largestDimension = Math.max(metadata.width, metadata.height);
  const ratio = Math.min(1, 960 / largestDimension);
  const width = toPositiveEven(metadata.width * ratio);
  const height = toPositiveEven(metadata.height * ratio);

  return [
    "-y",
    "-i",
    input,
    "-map",
    `0:${metadata.videoStreamIndex}`,
    "-vf",
    `scale=${width}:${height}:flags=lanczos`,
    "-c:v",
    "libx264",
    "-preset",
    "ultrafast",
    "-crf",
    "32",
    "-pix_fmt",
    "yuv420p",
    "-an",
    "-movflags",
    "+faststart",
    "-f",
    "mp4",
    output,
  ];
}

export function getStudioOutputGeometry(
  metadata: StudioMediaMetadata,
  settings: StudioSettings
): StudioOutputGeometry {
  return buildStudioTransform(metadata, settings).geometry;
}

export function buildStudioExportPlan(
  metadata: StudioMediaMetadata,
  settings: StudioSettings,
  input: string,
  output: string
): StudioExportPlan {
  const transform = buildStudioTransform(metadata, settings);
  let args: string[];

  switch (transform.snapshot.format) {
    case "gif":
      args = buildGifExportArgs(metadata, transform, input, output);
      break;
    case "webp":
      args = buildWebpExportArgs(metadata, transform, input, output);
      break;
    case "mp4":
    default:
      args = buildMp4ExportArgs(metadata, transform, input, output);
      break;
  }

  return {
    args,
    format: transform.snapshot.format,
    mimeType: MIME_TYPES[transform.snapshot.format],
    geometry: transform.geometry,
    effectiveDuration: transform.effectiveDuration,
  };
}

export function formatStudioBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"] as const;
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  const decimals = value < 10 ? 2 : 1;

  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

export function estimateMp4Bytes(
  metadata: StudioMediaMetadata,
  settings: StudioSettings
): number {
  const transform = buildStudioTransform(metadata, settings);
  const audioBitrate =
    transform.snapshot.mp4.includeAudio &&
    metadata.hasAudio &&
    readStreamIndex(metadata.audioStreamIndex) !== null
      ? transform.snapshot.mp4.audioBitrateKbps
      : 0;
  const totalBitsPerSecond =
    (transform.snapshot.mp4.videoBitrateKbps + audioBitrate) * 1000;

  return Math.ceil((transform.effectiveDuration * totalBitsPerSecond) / 8);
}

/** Conservative browser peak-memory estimate for the multithread core. */
export function estimateStudioPeakMemoryBytes(
  sourceBytes: number,
  metadata: StudioMediaMetadata,
  settings: StudioSettings
): number {
  const transform = buildStudioTransform(metadata, settings);
  const pixels = transform.geometry.width * transform.geometry.height;
  const frameRate =
    transform.snapshot.format === "gif"
      ? transform.snapshot.gif.fps
      : transform.snapshot.format === "webp"
        ? transform.snapshot.webp.fps
        : transform.snapshot.mp4.frameRate === "source"
          ? metadata.fps
          : transform.snapshot.mp4.frameRate;
  const frameCount = Math.ceil(transform.effectiveDuration * frameRate);
  const workingFrames = pixels * 4 * (transform.snapshot.format === "gif" ? 12 : 8);

  let estimatedOutputBytes: number;
  if (transform.snapshot.format === "mp4") {
    estimatedOutputBytes = estimateMp4Bytes(metadata, settings);
  } else {
    const bytesPerPixel =
      transform.snapshot.format === "gif"
        ? 0.2
        : transform.snapshot.webp.lossless
          ? 0.5
          : 0.15;
    estimatedOutputBytes = pixels * frameCount * bytesPerPixel;
  }

  const coreAndRuntime = 256 * 1024 * 1024;
  const inputCopies = Math.max(0, sourceBytes) * 2.2;
  const outputCopies = estimatedOutputBytes * 2.5;
  return Math.ceil(coreAndRuntime + inputCopies + workingFrames + outputCopies);
}

function buildMp4ExportArgs(
  metadata: StudioMediaMetadata,
  transform: StudioTransform,
  input: string,
  output: string
): string[] {
  const { snapshot } = transform;
  const videoLabel = "[studio_v]";
  const audioStreamIndex = readStreamIndex(metadata.audioStreamIndex);
  const includeAudio =
    snapshot.mp4.includeAudio && metadata.hasAudio && audioStreamIndex !== null;
  const filterParts = [
    `${streamSpecifier(metadata.videoStreamIndex)}${buildVideoFilter(transform, snapshot.mp4.frameRate)}${videoLabel}`,
  ];

  if (includeAudio) {
    filterParts.push(
      `${streamSpecifier(audioStreamIndex as number)}atrim=start=${formatNumber(
        snapshot.trimStart
      )}:end=${formatNumber(snapshot.trimEnd)},asetpts=PTS-STARTPTS,${buildAtempoFilter(
        snapshot.speed
      )}[studio_a]`
    );
  }

  const videoBitrate = snapshot.mp4.videoBitrateKbps;
  const args = [
    "-y",
    "-i",
    input,
    "-filter_complex",
    filterParts.join(";"),
    "-map",
    videoLabel,
    "-c:v",
    "libx264",
    "-b:v",
    `${videoBitrate}k`,
    "-maxrate",
    `${videoBitrate}k`,
    "-bufsize",
    `${videoBitrate * 2}k`,
    "-preset",
    snapshot.mp4.preset,
    "-pix_fmt",
    "yuv420p",
  ];

  if (includeAudio) {
    args.push(
      "-map",
      "[studio_a]",
      "-c:a",
      "aac",
      "-b:a",
      `${snapshot.mp4.audioBitrateKbps}k`,
      "-shortest"
    );
  } else {
    args.push("-an");
  }

  args.push("-movflags", "+faststart", "-f", "mp4", output);
  return args;
}

function buildGifExportArgs(
  metadata: StudioMediaMetadata,
  transform: StudioTransform,
  input: string,
  output: string
): string[] {
  const { gif } = transform.snapshot;
  const videoFilter = buildVideoFilter(transform, gif.fps);
  const filterComplex = `${streamSpecifier(
    metadata.videoStreamIndex
  )}${videoFilter},split[studio_frames][studio_palette_source];[studio_palette_source]palettegen=max_colors=${
    gif.colors
  }[studio_palette];[studio_frames][studio_palette]paletteuse=dither=${gif.dither}[studio_v]`;

  return [
    "-y",
    "-i",
    input,
    "-filter_complex",
    filterComplex,
    "-map",
    "[studio_v]",
    "-c:v",
    "gif",
    "-loop",
    gif.loopForever ? "0" : "-1",
    "-an",
    "-f",
    "gif",
    output,
  ];
}

function buildWebpExportArgs(
  metadata: StudioMediaMetadata,
  transform: StudioTransform,
  input: string,
  output: string
): string[] {
  const { webp } = transform.snapshot;

  return [
    "-y",
    "-i",
    input,
    "-filter_complex",
    `${streamSpecifier(metadata.videoStreamIndex)}${buildVideoFilter(
      transform,
      webp.fps
    )}[studio_v]`,
    "-map",
    "[studio_v]",
    "-c:v",
    "libwebp",
    "-quality",
    `${webp.quality}`,
    "-lossless",
    webp.lossless ? "1" : "0",
    "-compression_level",
    `${webp.compressionLevel}`,
    "-loop",
    webp.loopForever ? "0" : "1",
    "-vsync",
    "0",
    "-an",
    "-f",
    "webp",
    output,
  ];
}

function buildVideoFilter(
  transform: StudioTransform,
  frameRate: StudioMp4FrameRate | number
): string {
  const { snapshot, crop, geometry } = transform;
  const filters = [
    `trim=start=${formatNumber(snapshot.trimStart)}:end=${formatNumber(snapshot.trimEnd)}`,
    `setpts=(PTS-STARTPTS)/${formatNumber(snapshot.speed)}`,
    `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`,
    `scale=${geometry.width}:${geometry.height}:flags=lanczos`,
  ];

  if (frameRate !== "source") {
    filters.push(`fps=${frameRate}`);
  }

  return filters.join(",");
}

function buildAtempoFilter(speed: number): string {
  const factors: number[] = [];
  let remaining = speed;

  while (remaining < 0.5) {
    factors.push(0.5);
    remaining /= 0.5;
  }

  while (remaining > 2) {
    factors.push(2);
    remaining /= 2;
  }

  factors.push(remaining);
  return factors.map((factor) => `atempo=${formatNumber(factor)}`).join(",");
}

function buildStudioTransform(
  metadata: StudioMediaMetadata,
  settings: StudioSettings
): StudioTransform {
  assertUsableMetadata(metadata);
  const snapshot = normalizeSettings(metadata, settings);
  const crop = getPixelCrop(metadata, snapshot.crop);
  const geometry = {
    width: toPositiveEven(crop.width * (snapshot.scale / 100)),
    height: toPositiveEven(crop.height * (snapshot.scale / 100)),
  };

  return {
    snapshot,
    crop,
    geometry,
    effectiveDuration: (snapshot.trimEnd - snapshot.trimStart) / snapshot.speed,
  };
}

function normalizeSettings(
  metadata: StudioMediaMetadata,
  settings: StudioSettings
): NormalizedSnapshot {
  const firstTrimValue = finiteOr(settings?.trimRange?.[0], 0);
  const secondTrimValue = finiteOr(settings?.trimRange?.[1], metadata.duration);
  let trimStart = clamp(Math.min(firstTrimValue, secondTrimValue), 0, metadata.duration);
  let trimEnd = clamp(Math.max(firstTrimValue, secondTrimValue), 0, metadata.duration);

  if (trimEnd <= trimStart) {
    const minimumDuration = Math.min(0.001, metadata.duration);
    if (trimStart + minimumDuration <= metadata.duration) {
      trimEnd = trimStart + minimumDuration;
    } else {
      trimStart = Math.max(0, metadata.duration - minimumDuration);
      trimEnd = metadata.duration;
    }
  }

  const cropWidth = clamp(
    finiteOr(settings?.crop?.width, 100),
    MIN_CROP_PERCENT,
    100
  );
  const cropHeight = clamp(
    finiteOr(settings?.crop?.height, 100),
    MIN_CROP_PERCENT,
    100
  );

  return {
    format: isStudioOutputFormat(settings?.format) ? settings.format : "mp4",
    trimStart,
    trimEnd,
    crop: {
      x: clamp(finiteOr(settings?.crop?.x, 0), 0, 100 - cropWidth),
      y: clamp(finiteOr(settings?.crop?.y, 0), 0, 100 - cropHeight),
      width: cropWidth,
      height: cropHeight,
    },
    speed: clamp(finiteOr(settings?.speed, 1), 0.25, 4),
    scale: clamp(finiteOr(settings?.scale, 100), 25, 100),
    mp4: {
      videoBitrateKbps: clampInteger(
        settings?.mp4?.videoBitrateKbps,
        MIN_VIDEO_BITRATE_KBPS,
        MAX_VIDEO_BITRATE_KBPS,
        2_500
      ),
      frameRate: isStudioMp4FrameRate(settings?.mp4?.frameRate)
        ? settings.mp4.frameRate
        : "source",
      preset: isStudioMp4Preset(settings?.mp4?.preset) ? settings.mp4.preset : "veryfast",
      includeAudio: settings?.mp4?.includeAudio === true,
      audioBitrateKbps: clampInteger(
        settings?.mp4?.audioBitrateKbps,
        MIN_AUDIO_BITRATE_KBPS,
        MAX_AUDIO_BITRATE_KBPS,
        128
      ),
    },
    gif: {
      fps: clampInteger(settings?.gif?.fps, 5, 30, 15),
      colors: clampInteger(settings?.gif?.colors, 32, 256, 128),
      dither: isStudioGifDither(settings?.gif?.dither) ? settings.gif.dither : "sierra2_4a",
      loopForever: settings?.gif?.loopForever === true,
    },
    webp: {
      fps: clampInteger(settings?.webp?.fps, 5, 30, 15),
      quality: clampInteger(settings?.webp?.quality, 10, 100, 75),
      compressionLevel: clampInteger(settings?.webp?.compressionLevel, 0, 6, 4),
      lossless: settings?.webp?.lossless === true,
      loopForever: settings?.webp?.loopForever === true,
    },
  };
}

function getPixelCrop(metadata: StudioMediaMetadata, crop: StudioCrop): PixelCrop {
  const x = Math.min(metadata.width - 1, Math.floor((metadata.width * crop.x) / 100));
  const y = Math.min(metadata.height - 1, Math.floor((metadata.height * crop.y) / 100));
  const right = Math.min(
    metadata.width,
    Math.max(x + 1, Math.ceil((metadata.width * (crop.x + crop.width)) / 100))
  );
  const bottom = Math.min(
    metadata.height,
    Math.max(y + 1, Math.ceil((metadata.height * (crop.y + crop.height)) / 100))
  );

  return {
    x,
    y,
    width: right - x,
    height: bottom - y,
  };
}

function assertUsableMetadata(metadata: StudioMediaMetadata): void {
  if (
    !metadata ||
    !Number.isFinite(metadata.width) ||
    metadata.width <= 0 ||
    !Number.isFinite(metadata.height) ||
    metadata.height <= 0 ||
    !Number.isFinite(metadata.duration) ||
    metadata.duration <= 0 ||
    !Number.isFinite(metadata.fps) ||
    metadata.fps <= 0 ||
    readStreamIndex(metadata.videoStreamIndex) === null
  ) {
    throw new Error(
      "Studio media metadata must include a usable video stream with positive finite width, height, duration, and frame rate."
    );
  }
}

function readFrameRate(stream: ProbeStream): number | null {
  return parseRational(stream.avg_frame_rate) ?? parseRational(stream.r_frame_rate);
}

function parseRational(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parts = value.trim().split("/");
  if (parts.length === 1) {
    return readPositiveNumber(parts[0]);
  }
  if (parts.length !== 2) {
    return null;
  }

  const numerator = Number(parts[0]);
  const denominator = Number(parts[1]);
  const result = numerator / denominator;
  return Number.isFinite(result) && numerator > 0 && denominator > 0 && result > 0
    ? result
    : null;
}

function readRotation(stream: ProbeStream): number {
  const sideData = Array.isArray(stream.side_data_list) ? stream.side_data_list : [];
  const sideDataRotation = sideData
    .map((entry) => readFiniteNumber(entry?.rotation))
    .find((value): value is number => value !== null);
  const tagRotation = readFiniteNumber(stream.tags?.rotate);
  const rawRotation = sideDataRotation ?? tagRotation ?? 0;
  const normalized = ((Math.round(rawRotation) % 360) + 360) % 360;
  return normalized;
}

function isProbeStream(value: unknown): value is ProbeStream {
  return value !== null && typeof value === "object";
}

function isAttachedPicture(stream: ProbeStream): boolean {
  return Number(stream.disposition?.attached_pic) === 1;
}

function readPositiveNumber(value: unknown): number | null {
  const parsed = readFiniteNumber(value);
  return parsed !== null && parsed > 0 ? parsed : null;
}

function readFiniteNumber(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") {
    return null;
  }

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function readStreamIndex(value: unknown): number | null {
  const parsed = readFiniteNumber(value);
  return parsed !== null && Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function streamSpecifier(index: number): string {
  return `[0:${index}]`;
}

function toPositiveEven(value: number): number {
  return Math.max(2, Math.floor(value / 2) * 2);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function finiteOr(value: unknown, fallback: number): number {
  const parsed = readFiniteNumber(value);
  return parsed ?? fallback;
}

function clampInteger(
  value: unknown,
  minimum: number,
  maximum: number,
  fallback: number
): number {
  return Math.round(clamp(finiteOr(value, fallback), minimum, maximum));
}

function formatNumber(value: number): string {
  return Number(value.toFixed(NUMBER_PRECISION)).toString();
}

function isStudioOutputFormat(value: unknown): value is StudioOutputFormat {
  return value === "mp4" || value === "gif" || value === "webp";
}

function isStudioMp4FrameRate(value: unknown): value is StudioMp4FrameRate {
  return value === "source" || value === 24 || value === 30 || value === 60;
}

function isStudioMp4Preset(value: unknown): value is StudioMp4Preset {
  return value === "ultrafast" || value === "veryfast" || value === "medium";
}

function isStudioGifDither(value: unknown): value is StudioGifDither {
  return (
    value === "none" ||
    value === "bayer" ||
    value === "floyd_steinberg" ||
    value === "sierra2_4a"
  );
}
