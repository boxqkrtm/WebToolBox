"use client";

import { useEffect, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import UtilsLayout from "@/components/layout/UtilsLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useI18n } from "@/lib/i18n/i18nContext";

const BASE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

type OutputFormat = "mp4" | "webp";

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[index]}`;
};

export default function GifToMp4WebpPage() {
  const { t } = useI18n();
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("mp4");
  const [isConverting, setIsConverting] = useState(false);
  const [status, setStatus] = useState("");
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  useEffect(() => {
    return () => {
      if (sourceUrl) {
        URL.revokeObjectURL(sourceUrl);
      }
      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }
    };
  }, [resultUrl, sourceUrl]);

  const ensureFFmpegLoaded = async (withStatus = true) => {
    if (ffmpegLoaded && ffmpegRef.current) return ffmpegRef.current;

    const [{ toBlobURL }] = await Promise.all([import("@ffmpeg/util")]);

    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg();
    }

    if (withStatus) {
      setStatus(t("common.tools.gifToMp4Webp.page.loadingFfmpeg"));
    }

    await ffmpegRef.current.load({
      coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    setFfmpegLoaded(true);
    return ffmpegRef.current;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
    }
    if (resultUrl) {
      URL.revokeObjectURL(resultUrl);
      setResultUrl("");
    }

    setFile(selected);
    setSourceUrl(URL.createObjectURL(selected));
    setResultSize(null);
    setStatus("");
  };

  const convert = async () => {
    if (!file) return;

    setIsConverting(true);
    setStatus(t("common.tools.gifToMp4Webp.page.converting"));

    try {
      const ffmpeg = await ensureFFmpegLoaded();
      const { fetchFile } = await import("@ffmpeg/util");
      const inputName = "input.gif";
      const outputName = outputFormat === "mp4" ? "output.mp4" : "output.webp";

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      if (outputFormat === "mp4") {
        await ffmpeg.exec([
          "-i",
          inputName,
          "-movflags",
          "faststart",
          "-pix_fmt",
          "yuv420p",
          "-vf",
          "scale=trunc(iw/2)*2:trunc(ih/2)*2:flags=lanczos",
          outputName,
        ]);
      } else {
        await ffmpeg.exec([
          "-i",
          inputName,
          "-vcodec",
          "libwebp",
          "-loop",
          "0",
          "-an",
          "-vsync",
          "0",
          outputName,
        ]);
      }

      const data = await ffmpeg.readFile(outputName);
      if (typeof data === "string") {
        throw new Error("Unexpected text output from FFmpeg");
      }

      const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
      const blob = new Blob([bytes], {
        type: outputFormat === "mp4" ? "video/mp4" : "image/webp",
      });

      if (resultUrl) {
        URL.revokeObjectURL(resultUrl);
      }

      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setStatus(t("common.tools.gifToMp4Webp.page.done"));

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (error) {
      console.error(error);
      setStatus(t("common.tools.gifToMp4Webp.page.error"));
    } finally {
      setIsConverting(false);
    }
  };

  const downloadName = `${file?.name.replace(/\.gif$/i, "") || "converted"}.${outputFormat}`;

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{t("common.tools.gifToMp4Webp.page.title")}</h1>
          <p className="text-muted-foreground">{t("common.tools.gifToMp4Webp.page.description")}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gif-upload">{t("common.tools.gifToMp4Webp.page.upload")}</Label>
          <Input id="gif-upload" type="file" accept="image/gif" onChange={handleFileChange} />
          {file && (
            <p className="text-sm text-muted-foreground">
              {t("common.tools.gifToMp4Webp.page.selected")}: {file.name}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-md border p-4">
          <Label>{t("common.tools.gifToMp4Webp.page.outputFormat")}</Label>
          <RadioGroup
            value={outputFormat}
            onValueChange={(value) => setOutputFormat(value as OutputFormat)}
            className="grid gap-3 sm:grid-cols-2"
          >
            <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
              <RadioGroupItem value="mp4" id="gif-output-mp4" />
              <span>{t("common.tools.gifToMp4Webp.page.mp4Label")}</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border p-3 text-sm">
              <RadioGroupItem value="webp" id="gif-output-webp" />
              <span>{t("common.tools.gifToMp4Webp.page.webpLabel")}</span>
            </label>
          </RadioGroup>
          <Button onClick={convert} disabled={!file || isConverting}>
            {isConverting
              ? t("common.tools.gifToMp4Webp.page.converting")
              : t("common.tools.gifToMp4Webp.page.run")}
          </Button>
          {status && <p className="text-sm text-muted-foreground">{status}</p>}
        </div>

        {(sourceUrl || resultUrl) && (
          <div className="grid gap-4 md:grid-cols-2">
            {sourceUrl && (
              <div className="space-y-3 rounded-md border p-4">
                <p className="font-semibold">{t("common.tools.gifToMp4Webp.page.source")}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourceUrl}
                  alt={t("common.tools.gifToMp4Webp.page.source")}
                  className="max-h-[320px] w-full rounded object-contain"
                />
              </div>
            )}
            {resultUrl && (
              <div className="space-y-3 rounded-md border p-4">
                <p className="font-semibold">{t("common.tools.gifToMp4Webp.page.result")}</p>
                {resultSize !== null && (
                  <p className="text-sm text-muted-foreground">{formatBytes(resultSize)}</p>
                )}
                {outputFormat === "mp4" ? (
                  <video
                    src={resultUrl}
                    controls
                    loop
                    playsInline
                    className="max-h-[320px] w-full rounded border object-contain"
                  />
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resultUrl}
                      alt={t("common.tools.gifToMp4Webp.page.previewAlt")}
                      className="max-h-[320px] w-full rounded border object-contain"
                    />
                  </>
                )}
                <Button asChild>
                  <a href={resultUrl} download={downloadName}>
                    {t("common.tools.gifToMp4Webp.page.download")}
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </UtilsLayout>
  );
}
