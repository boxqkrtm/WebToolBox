import type { FFmpeg } from "@ffmpeg/ffmpeg";

export type DecodedWebpFrame = {
  png: Uint8Array;
  durationSec: number;
};

export type DecodedWebpSource = {
  width: number;
  height: number;
  frames: DecodedWebpFrame[];
};

type DecodedImage = CanvasImageSource & {
  duration?: number;
  close?: () => void;
  displayWidth: number;
  displayHeight: number;
};

type ImageDecoderLike = {
  tracks: {
    ready: Promise<unknown>;
    selectedTrack: { frameCount: number } | null;
  };
  decode: (options: { frameIndex: number }) => Promise<{ image: DecodedImage }>;
  close: () => void;
};

type ImageDecoderConstructor = new (init: { data: BufferSource; type: string }) => ImageDecoderLike;

const MIN_FRAME_DURATION_SEC = 0.01;
const STILL_DURATION_SEC = 1;
const RIFF = 0x52494646;
const WEBP = 0x57454250;
const VP8X = 0x56503858;

export async function decodeWebpSource(file: Blob): Promise<DecodedWebpSource> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isWebpBytes(bytes)) {
    throw new Error("Not a WebP file");
  }

  const Decoder = readImageDecoder();
  if (Decoder) {
    return decodeWithImageDecoder(Decoder, bytes, file.type || "image/webp");
  }

  if (isAnimatedWebp(bytes)) {
    throw new Error("Animated WebP requires ImageDecoder support");
  }

  return decodeStillWithBitmap(file);
}

export async function writeDecodedWebpAsMp4(
  ffmpeg: FFmpeg,
  source: DecodedWebpSource,
  outputName: string,
): Promise<void> {
  if (source.frames.length === 0) {
    throw new Error("WebP did not contain any frames");
  }

  const prefix = outputName.replace(/\.[^.]+$/, "");
  const listName = `${prefix}-concat.txt`;
  const frameNames = source.frames.map((_, index) => `${prefix}-${String(index).padStart(4, "0")}.png`);

  try {
    for (let index = 0; index < source.frames.length; index += 1) {
      await ffmpeg.writeFile(frameNames[index], source.frames[index].png);
    }
    await ffmpeg.writeFile(listName, buildConcatList(frameNames, source.frames));

    const exitCode = await ffmpeg.exec([
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listName,
      "-vsync",
      "vfr",
      "-pix_fmt",
      "yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-an",
      "-movflags",
      "+faststart",
      "-f",
      "mp4",
      outputName,
    ]);
    if (exitCode !== 0) {
      throw new Error(`WebP normalization exited with code ${exitCode}`);
    }
  } finally {
    await safeDelete(ffmpeg, listName);
    for (const frameName of frameNames) {
      await safeDelete(ffmpeg, frameName);
    }
  }
}

export function isAnimatedWebp(bytes: Uint8Array) {
  if (!isWebpBytes(bytes)) return false;

  let offset = 12;
  while (offset + 8 <= bytes.length) {
    const fourcc = readFourcc(bytes, offset);
    const size = readUint32Le(bytes, offset + 4);
    const payloadOffset = offset + 8;
    if (fourcc === VP8X && payloadOffset < bytes.length) {
      return (bytes[payloadOffset] & 0x02) !== 0;
    }
    offset = payloadOffset + size + (size & 1);
  }
  return false;
}

function readImageDecoder(): ImageDecoderConstructor | null {
  const candidate = Reflect.get(globalThis, "ImageDecoder");
  return typeof candidate === "function" ? candidate as ImageDecoderConstructor : null;
}

async function decodeWithImageDecoder(
  Decoder: ImageDecoderConstructor,
  bytes: Uint8Array,
  type: string,
): Promise<DecodedWebpSource> {
  const decoder = new Decoder({ data: bytes, type });
  try {
    await decoder.tracks.ready;
    const frameCount = Math.max(1, decoder.tracks.selectedTrack?.frameCount ?? 1);
    const images: DecodedImage[] = [];
    let width = 0;
    let height = 0;

    for (let index = 0; index < frameCount; index += 1) {
      const { image } = await decoder.decode({ frameIndex: index });
      images.push(image);
      width = Math.max(width, image.displayWidth);
      height = Math.max(height, image.displayHeight);
    }

    width = evenSize(width);
    height = evenSize(height);
    if (images.length === 0 || width < 2 || height < 2) {
      throw new Error("Unable to decode WebP frames");
    }

    const frames: DecodedWebpFrame[] = [];
    for (const image of images) {
      const durationSec = image.duration && image.duration > 0
        ? image.duration / 1_000_000
        : images.length === 1
          ? STILL_DURATION_SEC
          : MIN_FRAME_DURATION_SEC;
      frames.push({
        png: await rasterizeFrame(image, width, height),
        durationSec: Math.max(MIN_FRAME_DURATION_SEC, durationSec),
      });
      image.close?.();
    }

    return { width, height, frames };
  } finally {
    decoder.close();
  }
}

async function decodeStillWithBitmap(file: Blob): Promise<DecodedWebpSource> {
  const bitmap = await createImageBitmap(file);
  try {
    const width = evenSize(bitmap.width);
    const height = evenSize(bitmap.height);
    return {
      width,
      height,
      frames: [{ png: await rasterizeFrame(bitmap, width, height), durationSec: STILL_DURATION_SEC }],
    };
  } finally {
    bitmap.close();
  }
}

async function rasterizeFrame(image: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = evenSize(width);
  canvas.height = evenSize(height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");
  context.fillStyle = "#000000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((next) => {
      if (next) resolve(next);
      else reject(new Error("Unable to encode WebP frame as PNG"));
    }, "image/png");
  });
  return new Uint8Array(await blob.arrayBuffer());
}

function buildConcatList(frameNames: string[], frames: DecodedWebpFrame[]) {
  const lines: string[] = [];
  for (let index = 0; index < frames.length; index += 1) {
    lines.push(`file '${frameNames[index]}'`);
    lines.push(`duration ${frames[index].durationSec}`);
  }
  lines.push(`file '${frameNames[frameNames.length - 1]}'`);
  return `${lines.join("\n")}\n`;
}

function isWebpBytes(bytes: Uint8Array) {
  return bytes.length >= 12 && readFourcc(bytes, 0) === RIFF && readFourcc(bytes, 8) === WEBP;
}

function readFourcc(bytes: Uint8Array, offset: number) {
  return (
    (bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0;
}

function readUint32Le(bytes: Uint8Array, offset: number) {
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  ) >>> 0;
}

function evenSize(value: number) {
  return Math.max(2, Math.ceil(value / 2) * 2);
}

async function safeDelete(ffmpeg: FFmpeg, path: string) {
  try {
    await ffmpeg.deleteFile(path);
  } catch {
    // Temporary frame files may already be gone after a failed normalize.
  }
}
