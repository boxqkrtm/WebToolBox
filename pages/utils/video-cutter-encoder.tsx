"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import UtilsLayout from "@/components/layout/UtilsLayout";
import { useI18n } from "@/lib/i18n/i18nContext";

// FFmpeg will be imported dynamically on client side only

export default function VideoCutterEncoder() {
  const { t } = useI18n();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [trimValues, setTrimValues] = useState<[number, number]>([0, 0]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isSizeLimitEnabled, setIsSizeLimitEnabled] = useState<boolean>(false);
  const [sizeLimitPreset, setSizeLimitPreset] = useState<string>("1");
  const [customSizeLimit, setCustomSizeLimit] = useState<string>("10");
  const [progress, setProgress] = useState<number>(0);
  const [ffmpegLoaded, setFfmpegLoaded] = useState<boolean>(false);
  const [supportsFastTrim, setSupportsFastTrim] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ffmpegRef = useRef<any>(null);
  const [FFmpegConstructor, setFFmpegConstructor] = useState<any>(null);
  const [ffmpegUtils, setFfmpegUtils] = useState<any>(null);

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Clean up previous video URL if exists
        if (videoSrc) {
          URL.revokeObjectURL(videoSrc);
        }

        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoSrc(url);
        setTrimmedVideoSrc(""); // Clear previous trimmed video
        setProgress(0);
        setMessage("");

        // Check if format supports fast trim (mp4, webm, mkv)
        const extension = file.name.toLowerCase().split(".").pop();
        const fastTrimFormats = ["mp4", "webm", "mkv", "mov"];
        setSupportsFastTrim(fastTrimFormats.includes(extension || ""));

        // Set video source after state update
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.src = url;
            videoRef.current.load();
          }
        }, 0);
      }
    };

    input.click();
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setTrimValues([0, videoDuration]);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSliderChange = (newValues: [number, number]) => {
    const [oldStart, oldEnd] = trimValues;
    const [newStart, newEnd] = newValues;

    setTrimValues(newValues);

    if (videoRef.current) {
      // Seek the video to the thumb that was moved
      if (newStart !== oldStart) {
        videoRef.current.currentTime = newStart;
      } else if (newEnd !== oldEnd) {
        videoRef.current.currentTime = newEnd;
      }
    }
  };

  // Load FFmpeg modules dynamically on client side
  useEffect(() => {
    const loadModules = async () => {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");
      setFFmpegConstructor(() => FFmpeg);
      setFfmpegUtils({ fetchFile, toBlobURL });
    };
    loadModules();

    // Cleanup function to remove listeners when component unmounts
    return () => {
      if (ffmpegRef.current) {
        ffmpegRef.current.off("progress");
      }
    };
  }, []);

  const loadFFmpeg = async () => {
    if (!FFmpegConstructor || !ffmpegUtils) {
      setMessage(t('common.tools.videoCutterEncoder.page.ffmpegNotLoaded'));
      return;
    }

    const baseURL =
      "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd";

    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpegConstructor();
    }

    const ffmpeg = ffmpegRef.current;
    const { toBlobURL } = ffmpegUtils;

    setMessage(t('common.tools.videoCutterEncoder.page.loadingFFmpeg'));

    // Remove any existing progress listeners
    ffmpeg.off("progress");

    // Load FFmpeg core
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });

    setFfmpegLoaded(true);
    setMessage(t('common.tools.videoCutterEncoder.page.ffmpegLoaded'));
    // Reset progress when FFmpeg is loaded
    setProgress(0);
  };

  const handleTrim = async (mode: "fast" | "slow" | "low") => {
    if (!videoFile) return;

    // Reset progress immediately before any async operations
    setProgress(0);
    setIsLoading(true);
    setTrimmedVideoSrc(""); // Clear previous trimmed video

    try {
      // Load FFmpeg if not already loaded
      if (!ffmpegLoaded) {
        await loadFFmpeg();
      }

      // Get ffmpeg instance after loading
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg) {
        throw new Error("FFmpeg failed to load");
      }

      setMessage(t('common.tools.videoCutterEncoder.page.writingFile'));

      // Check file size and warn if too large
      const fileSizeMB = videoFile.size / (1024 * 1024);
      if (fileSizeMB > 100) {
        setMessage(
          t('common.tools.videoCutterEncoder.page.largeFileWarning').replace(
            '{size}',
            fileSizeMB.toFixed(1)
          )
        );
      }

      await ffmpeg.writeFile(
        "input.mp4",
        await ffmpegUtils.fetchFile(videoFile)
      );

      const [start, end] = trimValues;
      const trimDuration = end - start;

      // Set up progress listener with trim-adjusted calculation
      ffmpeg.off("progress");
      // Force progress to 0 before setting up new listener
      setProgress(0);
      setMessage(`${t('common.tools.videoCutterEncoder.page.processing')} ${0}%`);
      ffmpeg.on("progress", ({ progress: progressRatio, time }: { progress: number; time: number }) => {
        // Calculate progress based on trimmed portion
        const adjustedProgress = (progressRatio * duration) / trimDuration;
        const percentage = Math.min(Math.round(adjustedProgress * 100), 100);
        if (progressRatio > 1.1) {
          setProgress(0);
          setMessage(`${t('common.tools.videoCutterEncoder.page.processing')} 0%`);
        } else {
          setProgress(percentage);
          setMessage(`${t('common.tools.videoCutterEncoder.page.processing')} ${percentage}%`);
        }
      });

      let command: string[];
      if (mode === "fast" && !isSizeLimitEnabled) {
        setMessage(t('common.tools.videoCutterEncoder.page.trimmingFast'));
        // Get file extension for output
        const extension =
          videoFile.name.toLowerCase().split(".").pop() || "mp4";
        command = [
          "-i",
          "input.mp4",
          "-ss",
          `${start}`,
          "-to",
          `${end}`,
          "-c",
          "copy",
          `output.${extension}`,
        ];
      } else if (isSizeLimitEnabled) {
        const targetSizeMB =
          sizeLimitPreset === "custom"
            ? parseFloat(customSizeLimit)
            : parseFloat(sizeLimitPreset);

        if (isNaN(targetSizeMB) || targetSizeMB < 1) {
          setMessage(t('common.tools.videoCutterEncoder.page.invalidSizeLimit'));
          setIsLoading(false);
          return;
        }

        const targetSizeBytes = targetSizeMB * 1024 * 1024;
        const estimatedTrimmedSizeBytes =
          (videoFile.size * trimDuration) / duration;

        if (targetSizeBytes < estimatedTrimmedSizeBytes) {
          setMessage(t('common.tools.videoCutterEncoder.page.targetSizeSmaller'));
          const totalBitrate = (targetSizeBytes * 8) / trimDuration;
          const audioBitrate = 128 * 1024; // 128 kbps
          const videoBitrate = totalBitrate - audioBitrate;

          if (videoBitrate <= 0) {
            setMessage(
              t('common.tools.videoCutterEncoder.page.targetSizeTooSmall')
            );
            setIsLoading(false);
            return;
          }

          const videoBitrateK = Math.floor(videoBitrate / 1024);

          command = [
            "-i",
            "input.mp4",
            "-ss",
            `${start}`,
            "-to",
            `${end}`,
            "-c:v",
            "libx264",
            "-b:v",
            `${videoBitrateK}k`,
            "-preset",
            "medium",
            "-threads",
            "0",
            "-c:a",
            "aac",
            "-b:a",
            "128k",
            "output.mp4",
          ];
        } else {
          setMessage(
            t('common.tools.videoCutterEncoder.page.targetSizeLarger')
          );
          command = [
            "-i",
            "input.mp4",
            "-ss",
            `${start}`,
            "-to",
            `${end}`,
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "23",
            "-threads",
            "1",
            "-c:a",
            "aac",
            "output.mp4",
          ];
        }
      } else if (mode === "low") {
        setMessage(t('common.tools.videoCutterEncoder.page.trimmingLowQuality'));
        command = [
          "-i",
          "input.mp4",
          "-ss",
          `${start}`,
          "-to",
          `${end}`,
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "28",
          "-threads",
          "0",
          "-c:a",
          "aac",
          "-b:a",
          "96k",
          "output.mp4",
        ];
      } else {
        setMessage(t('common.tools.videoCutterEncoder.page.trimmingPrecise'));
        command = [
          "-i",
          "input.mp4",
          "-ss",
          `${start}`,
          "-to",
          `${end}`,
          "-c:v",
          "libx264",
          "-preset",
          "medium",
          "-crf",
          "23",
          "-threads",
          "1",
          "-c:a",
          "aac",
          "output.mp4",
        ];
      }

      await ffmpeg.exec(command);

      // Clean up progress listener after completion
      ffmpeg.off("progress");

      setMessage(t('common.tools.videoCutterEncoder.page.readingResult'));
      // Get output filename based on mode
      const extension = videoFile.name.toLowerCase().split(".").pop() || "mp4";
      const outputFile =
        mode === "fast" && !isSizeLimitEnabled
          ? `output.${extension}`
          : "output.mp4";
      const mimeType =
        mode === "fast" && !isSizeLimitEnabled
          ? `video/${extension}`
          : "video/mp4";

      const data = await ffmpeg.readFile(outputFile);
      const blob = new Blob([new Uint8Array(data as ArrayBuffer)], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setTrimmedVideoSrc(url);
      setMessage(t('common.tools.videoCutterEncoder.page.done'));
      setProgress(0);
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes("memory")) {
        setMessage(
          t('common.tools.videoCutterEncoder.page.memoryError')
        );
      } else {
        setMessage(
          `${t('common.tools.videoCutterEncoder.page.errorOccurred')}: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    } finally {
      setIsLoading(false);
      setProgress(0);
      // Clean up any remaining listeners
      if (ffmpegRef.current) {
        ffmpegRef.current.off("progress");
      }
    }
  };

  return (
    <UtilsLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t('common.tools.videoCutterEncoder.title')}</h1>

        <div className="space-y-2">
          <Label>{t('common.tools.videoCutterEncoder.page.selectVideo')}</Label>
          <Button
            onClick={handleFileSelect}
            variant="outline"
            className="w-full"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {videoFile
              ? t('common.tools.videoCutterEncoder.page.selectedFile').replace('{name}', videoFile.name)
              : t('common.tools.videoCutterEncoder.page.chooseVideoFile')}
          </Button>
        </div>

        {videoSrc && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('common.tools.videoCutterEncoder.page.originalVideo')}</h2>
            <video
              ref={videoRef}
              controls
              className="w-full rounded"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              preload="metadata"
              crossOrigin="anonymous"
            />

            {duration > 0 && (
              <div className="space-y-2">
                <Label>{t('common.tools.videoCutterEncoder.page.trimRange')}</Label>
                <Slider
                  min={0}
                  max={duration}
                  step={0.1}
                  value={trimValues}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between text-sm">
                  <span>{t('common.tools.videoCutterEncoder.page.start')}: {trimValues[0].toFixed(1)}s</span>
                  <span className="font-semibold">
                    {t('common.tools.videoCutterEncoder.page.current')}: {currentTime.toFixed(1)}s
                  </span>
                  <span>{t('common.tools.videoCutterEncoder.page.end')}: {trimValues[1].toFixed(1)}s</span>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="space-y-2 p-4 bg-gray-100 rounded-md">
                <p className="text-center">{message}</p>
                {progress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 rounded-md border p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="size-limit-checkbox"
                  checked={isSizeLimitEnabled}
                  onCheckedChange={(checked) =>
                    setIsSizeLimitEnabled(Boolean(checked))
                  }
                />
                <Label htmlFor="size-limit-checkbox">
                  {t('common.tools.videoCutterEncoder.page.limitOutputFileSize')}
                </Label>
              </div>

              {isSizeLimitEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={sizeLimitPreset}
                    onValueChange={setSizeLimitPreset}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('common.tools.videoCutterEncoder.page.selectSizeLimit')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 MB</SelectItem>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                      <SelectItem value="100">100 MB</SelectItem>
                      <SelectItem value="custom">{t('common.tools.videoCutterEncoder.page.custom')}</SelectItem>
                    </SelectContent>
                  </Select>
                  {sizeLimitPreset === "custom" && (
                    <Input
                      type="number"
                      value={customSizeLimit}
                      onChange={(e) => setCustomSizeLimit(e.target.value)}
                      min="1"
                      placeholder={t('common.tools.videoCutterEncoder.page.mbPlaceholder')}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  handleTrim(isSizeLimitEnabled ? "slow" : "fast");
                }}
                disabled={
                  isLoading ||
                  !videoFile ||
                  (!supportsFastTrim && !isSizeLimitEnabled)
                }
                title={
                  !supportsFastTrim && !isSizeLimitEnabled
                    ? t('common.tools.videoCutterEncoder.page.formatRequiresReencoding')
                    : ""
                }
              >
                {isLoading ? t('common.tools.videoCutterEncoder.page.processing') : t('common.tools.videoCutterEncoder.page.process')}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {isSizeLimitEnabled
                ? t('common.tools.videoCutterEncoder.page.sizeLimitRequiresReencoding')
                : supportsFastTrim
                ? t('common.tools.videoCutterEncoder.page.processFastTrim')
                : t('common.tools.videoCutterEncoder.page.formatRequiresReencodingLonger')}
            </p>
          </div>
        )}

        {trimmedVideoSrc && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">{t('common.tools.videoCutterEncoder.page.trimmedVideo')}</h2>
            <video src={trimmedVideoSrc} controls className="w-full rounded" />
            <div className="flex items-center space-x-2">
              <a
                href={trimmedVideoSrc}
                download={`trimmed-${
                  videoFile?.name?.replace(/\.[^/.]+$/, "") || "video"
                }.mp4`}
              >
                <Button>{t('common.tools.videoCutterEncoder.page.downloadTrimmedVideo')}</Button>
              </a>
              <Button
                onClick={() => {
                  handleTrim("slow");
                }}
                disabled={isLoading || !videoFile}
                variant="outline"
              >
                {t('common.tools.videoCutterEncoder.page.fixHighQuality')}
              </Button>
              <Button
                onClick={() => {
                  handleTrim("low");
                }}
                disabled={isLoading || !videoFile}
                variant="outline"
              >
                {t('common.tools.videoCutterEncoder.page.fixLowQuality')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </UtilsLayout>
  );
}
