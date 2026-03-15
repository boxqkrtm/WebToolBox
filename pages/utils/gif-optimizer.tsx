"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import UtilsLayout from "@/components/layout/UtilsLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/i18nContext";

const FFMPEG_BASE_URL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

export default function GifOptimizer() {
  const { t } = useI18n();
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [sourceSize, setSourceSize] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [sourceWidth, setSourceWidth] = useState(0);
  const [sourceHeight, setSourceHeight] = useState(0);
  const [resizeWidth, setResizeWidth] = useState(480);
  const [frameRate, setFrameRate] = useState(12);
  const [lossyLevel, setLossyLevel] = useState(80);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const resizeHeight = useMemo(() => {
    if (!sourceWidth || !sourceHeight || !resizeWidth) return 0;
    return Math.max(2, Math.round((resizeWidth / sourceWidth) * sourceHeight));
  }, [sourceHeight, sourceWidth, resizeWidth]);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl, sourceUrl]);

  const ensureFfmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    setStatus(t("common.tools.gifOptimizer.page.loadingEngine"));
    await ffmpeg.load({
      coreURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${FFMPEG_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
      setResizeWidth(Math.max(2, Math.round(image.width * 0.75)));
    };
    image.src = url;
  };

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
        `fps=${frameRate},scale=${resizeWidth}:-1:flags=lanczos,palettegen=max_colors=${colors}`,
        "palette.png",
      ]);

      await ffmpeg.exec([
        "-i",
        "input.gif",
        "-i",
        "palette.png",
        "-lavfi",
        `fps=${frameRate},scale=${resizeWidth}:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3`,
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
      setStatus(`${t("common.tools.gifOptimizer.page.error")}: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <UtilsLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t("common.tools.gifOptimizer.title")}</h1>
        <p className="text-muted-foreground">{t("common.tools.gifOptimizer.page.description")}</p>

        <div className="space-y-2">
          <Label htmlFor="gif-upload">{t("common.tools.gifOptimizer.page.upload")}</Label>
          <Input id="gif-upload" type="file" accept="image/gif" onChange={handleFileChange} />
        </div>

        {sourceFile && (
          <div className="space-y-4 rounded-md border p-4">
            <p className="text-sm text-muted-foreground">{t("common.tools.gifOptimizer.page.gifsicleArgs")}: ["--lossy={lossyLevel}", "-O3"]</p>

            <div className="space-y-2">
              <Label htmlFor="resize-width">{t("common.tools.gifOptimizer.page.resizeWidth")}: {resizeWidth}px ({resizeHeight}px)</Label>
              <input id="resize-width" type="range" className="w-full" min={Math.max(2, Math.floor(sourceWidth * 0.2))} max={sourceWidth} value={resizeWidth} onChange={(e) => setResizeWidth(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fps">{t("common.tools.gifOptimizer.page.frameRate")}: {frameRate} FPS</Label>
              <input id="fps" type="range" className="w-full" min={5} max={30} value={frameRate} onChange={(e) => setFrameRate(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lossy">{t("common.tools.gifOptimizer.page.lossy")}: {lossyLevel}</Label>
              <input id="lossy" type="range" className="w-full" min={0} max={200} value={lossyLevel} onChange={(e) => setLossyLevel(Number(e.target.value))} />
            </div>

            <Button onClick={handleOptimize} disabled={isLoading}>{isLoading ? t("common.tools.gifOptimizer.page.optimizing") : t("common.tools.gifOptimizer.page.run")}</Button>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </div>
        )}

        {(sourceUrl || resultUrl) && (
          <div className="grid gap-4 md:grid-cols-2">
            {sourceUrl && (
              <div className="space-y-2 rounded-md border p-4">
                <p className="font-semibold">{t("common.tools.gifOptimizer.page.before")}</p>
                <p className="text-sm text-muted-foreground">{formatSize(sourceSize)}</p>
                <img src={sourceUrl} alt={t("common.tools.gifOptimizer.page.before")} className="max-h-[300px] w-full object-contain" />
              </div>
            )}
            {resultUrl && (
              <div className="space-y-2 rounded-md border p-4">
                <p className="font-semibold">{t("common.tools.gifOptimizer.page.after")}</p>
                <p className="text-sm text-muted-foreground">{formatSize(resultSize)}</p>
                <img src={resultUrl} alt={t("common.tools.gifOptimizer.page.after")} className="max-h-[300px] w-full object-contain" />
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
