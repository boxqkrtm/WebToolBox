"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import UtilsLayout from "@/components/layout/UtilsLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { FileUploadButton } from '@/components/ui/file-upload-button'
import { loadGifTransfer, removeGifTransfer } from "@/lib/gifTransfer";
import { useI18n } from "@/lib/i18n/i18nContext";

const FFMPEG_BASE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

export default function GifOptimizer() {
  const { t } = useI18n();
  const router = useRouter();
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [sourceSize, setSourceSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [sourceWidth, setSourceWidth] = useState(0);
  const [sourceHeight, setSourceHeight] = useState(0);
  const [sourceFrameRate, setSourceFrameRate] = useState(30);
  const [resizeScale, setResizeScale] = useState(100);
  const [frameRate, setFrameRate] = useState(30);
  const [lossyLevel, setLossyLevel] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const resizeHeight = useMemo(() => {
    if (!sourceWidth || !sourceHeight || !resizeScale) return 0;
    const resizeWidth = Math.max(2, Math.round((sourceWidth * resizeScale) / 100));
    return Math.max(2, Math.round((resizeWidth / sourceWidth) * sourceHeight));
  }, [resizeScale, sourceHeight, sourceWidth]);

  const resizeWidth = sourceWidth
    ? Math.max(2, Math.round((sourceWidth * resizeScale) / 100))
    : 0;
  const maxSourceFrameRate = Math.max(1, Math.round(sourceFrameRate));

  const parseFrameRate = (rawValue: string) => {
    const lines = rawValue
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (line.includes("/")) {
        const [numeratorText, denominatorText] = line.split("/");
        const numerator = Number(numeratorText);
        const denominator = Number(denominatorText);
        if (Number.isFinite(numerator) && Number.isFinite(denominator) && denominator > 0) {
          const parsed = numerator / denominator;
          if (parsed > 0) {
            return parsed;
          }
        }
      }

      const parsed = Number(line);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return null;
  };

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl, sourceUrl]);

  const applySourceFile = (file: File) => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl("");
      setResultSize(0);
    }

    const url = URL.createObjectURL(file);
    setSourceFile(file);
    setSourceUrl(url);
    setSourceSize(file.size);
    setStatus("");

    const image = new Image();
    image.onload = () => {
      setSourceWidth(image.width);
      setSourceHeight(image.height);
      setResizeScale(100);
    };
    image.src = url;

    void probeSourceFrameRate(file);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const transferId = router.query.transfer;
    if (typeof transferId !== "string") return;

    const importTransferredGif = async () => {
      try {
        const payload = await loadGifTransfer(transferId);
        if (!payload) {
          setStatus(t("common.tools.gifOptimizer.page.transferNotFound"));
          return;
        }

        const file = new File([payload.blob], payload.fileName, {
          type: payload.mimeType || "image/gif",
        });

        applySourceFile(file);
        setStatus(t("common.tools.gifOptimizer.page.transferLoaded"));
        await removeGifTransfer(transferId);
        void router.replace("/utils/gif-optimizer", undefined, { shallow: true });
      } catch (error) {
        console.error(error);
        setStatus(t("common.tools.gifOptimizer.page.transferError"));
      }
    };

    void importTransferredGif();
  }, [router.isReady, router.query.transfer, t]);

  const ensureFfmpeg = async (withStatus = true) => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    if (withStatus) {
      setStatus(t("common.tools.gifOptimizer.page.loadingEngine"));
    }
    await ffmpeg.load({
      coreURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const probeSourceFrameRate = async (file: File) => {
    try {
      const ffmpeg = await ensureFfmpeg(false);
      await ffmpeg.writeFile("probe-input.gif", await fetchFile(file));
      await ffmpeg.ffprobe([
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=avg_frame_rate,r_frame_rate",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        "probe-input.gif",
        "-o",
        "probe-output.txt",
      ]);

      const output = await ffmpeg.readFile("probe-output.txt", "utf8");
      const parsedFrameRate = parseFrameRate(String(output));
      if (parsedFrameRate) {
        setSourceFrameRate(parsedFrameRate);
        setFrameRate(Math.max(1, Math.round(parsedFrameRate)));
      }

      await ffmpeg.deleteFile("probe-input.gif");
      await ffmpeg.deleteFile("probe-output.txt");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return

    applySourceFile(file)
  }

  const handleOptimize = async () => {
    if (!sourceFile || !resizeHeight) return;

    setIsLoading(true);

    try {
      const ffmpeg = await ensureFfmpeg();
      const colors = Math.max(32, Math.min(256, 256 - Math.round(lossyLevel * 2.2)));

      setStatus(t("common.tools.gifOptimizer.page.optimizing"));

      await ffmpeg.writeFile("input.gif", await fetchFile(sourceFile));

      await ffmpeg.exec([
        "-i",
        "input.gif",
        "-vf",
        `fps=${frameRate},setpts=N/(${frameRate}*TB),scale=${resizeWidth}:-1:flags=lanczos,palettegen=max_colors=${colors}`,
        "palette.png",
      ]);

      await ffmpeg.exec([
        "-i",
        "input.gif",
        "-i",
        "palette.png",
        "-lavfi",
        `fps=${frameRate},setpts=N/(${frameRate}*TB),scale=${resizeWidth}:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3`,
        "-loop",
        "0",
        "output.gif",
      ]);

      const data = await ffmpeg.readFile("output.gif");
      const blob = new Blob([data as Uint8Array], { type: "image/gif" });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultSize(blob.size);
      setResultUrl(URL.createObjectURL(blob));
      setStatus(t("common.tools.gifOptimizer.page.done"));

      await ffmpeg.deleteFile("input.gif");
      await ffmpeg.deleteFile("palette.png");
      await ffmpeg.deleteFile("output.gif");
    } catch (error) {
      console.error(error);
      setStatus(t("common.tools.gifOptimizer.page.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("common.tools.gifOptimizer.title")}</h1>
        <p className="text-muted-foreground">{t("common.tools.gifOptimizer.page.description")}</p>

        <div className="space-y-2">
          <Label htmlFor="gif-upload">{t("common.tools.gifOptimizer.page.upload")}</Label>
          <FileUploadButton
            id="gif-upload"
            accept="image/gif"
            onFileSelect={handleFileChange}
            label={t("common.tools.gifOptimizer.page.upload")}
          />
        </div>

        {sourceFile && (
          <div className="space-y-4 rounded-md border p-4">
            <p className="text-sm text-muted-foreground">
              {t("common.tools.gifOptimizer.page.gifsicleArgs")}: ["--lossy={lossyLevel}", "-O3"]
            </p>

            <div className="space-y-2">
                <Label htmlFor="resize-width">
                {t("common.tools.gifOptimizer.page.resizeWidth")}: {resizeScale}% ({resizeWidth}px x {resizeHeight}px)
              </Label>
              <input
                id="resize-width"
                type="range"
                className="w-full"
                min={1}
                max={100}
                value={resizeScale}
                onChange={(event) => setResizeScale(Number(event.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fps">{t("common.tools.gifOptimizer.page.frameRate")}: {frameRate} FPS</Label>
              <input
                id="fps"
                type="range"
                className="w-full"
                min={1}
                max={maxSourceFrameRate}
                value={frameRate}
                onChange={(event) => setFrameRate(Number(event.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lossy">{t("common.tools.gifOptimizer.page.lossy")}: {lossyLevel}</Label>
              <input
                id="lossy"
                type="range"
                className="w-full"
                min={0}
                max={200}
                value={lossyLevel}
                onChange={(event) => setLossyLevel(Number(event.target.value))}
              />
            </div>

            <Button onClick={handleOptimize} disabled={isLoading}>
              {isLoading ? t("common.tools.gifOptimizer.page.optimizing") : t("common.tools.gifOptimizer.page.run")}
            </Button>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </div>
        )}

        {(sourceUrl || resultUrl) && (
          <div className="grid gap-4 md:grid-cols-2">
            {sourceUrl && (
              <div className="space-y-2 rounded-md border p-4">
                <p className="font-semibold">{t("common.tools.gifOptimizer.page.before")}</p>
                <p className="text-sm text-muted-foreground">{formatSize(sourceSize)}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourceUrl}
                  alt={t("common.tools.gifOptimizer.page.before")}
                  className="max-h-[300px] w-full object-contain"
                />
              </div>
            )}
            {resultUrl && (
              <div className="space-y-2 rounded-md border p-4">
                <p className="font-semibold">{t("common.tools.gifOptimizer.page.after")}</p>
                <p className="text-sm text-muted-foreground">{formatSize(resultSize)}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultUrl}
                  alt={t("common.tools.gifOptimizer.page.after")}
                  className="max-h-[300px] w-full object-contain"
                />
                <a href={resultUrl} download={`${sourceFile?.name.replace(/\.gif$/i, "") || "optimized"}-optimized.gif`}>
                  <Button>{t("common.tools.gifOptimizer.page.download")}</Button>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </UtilsLayout>
  );
}
