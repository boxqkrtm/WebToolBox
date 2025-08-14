'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Muxer, ArrayBufferTarget } from 'mp4-muxer'
import * as MP4Box from 'mp4box'
import UtilsLayout from '@/components/layout/UtilsLayout'

export default function VideoCutterEncoder() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoSrc, setVideoSrc] = useState<string>('')
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState<string>('')
  const [duration, setDuration] = useState<number>(0)
  const [trimValues, setTrimValues] = useState<[number, number]>([0, 0])
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [isSizeLimitEnabled, setIsSizeLimitEnabled] = useState<boolean>(false)
  const [sizeLimitPreset, setSizeLimitPreset] = useState<string>('1')
  const [customSizeLimit, setCustomSizeLimit] = useState<string>('10')
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration
      setDuration(videoDuration)
      setTrimValues([0, videoDuration])
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSliderChange = (newValues: [number, number]) => {
    const [oldStart, oldEnd] = trimValues
    const [newStart, newEnd] = newValues

    setTrimValues(newValues)

    if (videoRef.current) {
      if (newStart !== oldStart) {
        videoRef.current.currentTime = newStart
      } else if (newEnd !== oldEnd) {
        videoRef.current.currentTime = newEnd
      }
    }
  }

  const encodeWithWebCodecs = () => new Promise<void>((resolve, reject) => {
    if (!videoFile) return reject(new Error('No video file selected'))

    setMessage('Starting to process video...')
    const mp4boxfile = MP4Box.createFile()

    mp4boxfile.onError = (e: any) => reject(new Error(`MP4Box error: ${e}`))

    let videoDecoder: VideoDecoder;
    let audioDecoder: AudioDecoder;
    let videoEncoder: VideoEncoder;
    let audioEncoder: AudioEncoder | undefined;
    let muxer: Muxer<ArrayBufferTarget>;

    mp4boxfile.onReady = (info) => {
      setMessage('Video metadata loaded. Preparing pipeline...')

      let videoTrack = info.tracks.find(track => track.codec.startsWith('avc1'))
      let audioTrack = info.tracks.find(track => track.codec.startsWith('mp4a'))

      if (!videoTrack || !videoTrack.video) {
        return reject(new Error('No H.264 video track with video metadata found.'))
      }
      if (audioTrack && !audioTrack.audio) {
        console.warn('Audio track is missing audio metadata, proceeding without it.')
        audioTrack = undefined
      }

      const [start, end] = trimValues
      const trimDuration = end - start

      videoDecoder = new VideoDecoder({
        output: (frame) => videoEncoder.encode(frame),
        error: (e) => reject(new Error(`VideoDecoder error: ${e.message}`)),
      });

      audioDecoder = new AudioDecoder({
        output: (frame) => audioEncoder?.encode(frame),
        error: (e) => reject(new Error(`AudioDecoder error: ${e.message}`)),
      });

      muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: 'avc',
          width: videoTrack.video.width,
          height: videoTrack.video.height,
        },
        audio: audioTrack && audioTrack.audio ? {
          codec: 'aac',
          numberOfChannels: audioTrack.audio.channel_count,
          sampleRate: audioTrack.audio.sample_rate,
        } : undefined,
        fastStart: 'in-memory',
      });

      videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => reject(new Error(`VideoEncoder error: ${e.message}`)),
      });

      if (audioTrack) {
        audioEncoder = new AudioEncoder({
          output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
          error: (e) => reject(new Error(`AudioEncoder error: ${e.message}`)),
        });
      }

      videoDecoder.configure({
        codec: videoTrack.codec,
        description: (videoTrack as any).description,
        codedWidth: videoTrack.video.width,
        codedHeight: videoTrack.video.height,
      });

      let targetVideoBitrate = 2_000_000; // Default 2 Mbps
      const audioBitrate = 128_000; // 128 kbps

      if (isSizeLimitEnabled) {
        const targetSizeMB = sizeLimitPreset === 'custom'
          ? parseFloat(customSizeLimit)
          : parseFloat(sizeLimitPreset);

        if (!isNaN(targetSizeMB) && targetSizeMB >= 1) {
          const targetTotalBitrate = (targetSizeMB * 1024 * 1024 * 8) / trimDuration;
          targetVideoBitrate = targetTotalBitrate - (audioTrack ? audioBitrate : 0);
          if (targetVideoBitrate <= 0) {
            return reject(new Error('Target size is too small for this duration.'))
          }
        }
      }

      videoEncoder.configure({
        codec: 'avc1.42001E',
        width: videoTrack.video.width,
        height: videoTrack.video.height,
        bitrate: targetVideoBitrate,
        framerate: videoTrack.nb_samples / videoTrack.movie_duration * videoTrack.timescale,
        hardwareAcceleration: 'prefer-software',
      });

      if (audioTrack && audioTrack.audio && audioEncoder) {
        audioDecoder.configure({
          codec: audioTrack.codec,
          description: (audioTrack as any).description,
          numberOfChannels: audioTrack.audio.channel_count,
          sampleRate: audioTrack.audio.sample_rate,
        });
        audioEncoder.configure({
          codec: 'mp4a.40.2',
          numberOfChannels: audioTrack.audio.channel_count,
          sampleRate: audioTrack.audio.sample_rate,
          bitrate: audioBitrate,
        });
      }

      mp4boxfile.onSamples = (trackId, ref, samples) => {
        for (const sample of samples) {
          if (!sample.data) continue;
          const timestamp = sample.cts / sample.timescale;
          if (timestamp < start || timestamp > end) continue;

          if (trackId === videoTrack.id) {
            videoDecoder.decode(new EncodedVideoChunk({
              type: sample.is_sync ? 'key' : 'delta',
              timestamp: (timestamp - start) * 1_000_000,
              duration: sample.duration / sample.timescale * 1_000_000,
              data: sample.data,
            }));
          } else if (audioTrack && trackId === audioTrack.id) {
            audioDecoder.decode(new EncodedAudioChunk({
              type: sample.is_sync ? 'key' : 'delta',
              timestamp: (timestamp - start) * 1_000_000,
              duration: sample.duration / sample.timescale * 1_000_000,
              data: sample.data,
            }));
          }
        }
      };

      setMessage('Decoding and re-encoding...');
      mp4boxfile.setExtractionOptions(videoTrack.id, 'video', { nbSamples: 100 });
      if (audioTrack) {
        mp4boxfile.setExtractionOptions(audioTrack.id, 'audio', { nbSamples: 100 });
      }
      mp4boxfile.start();
    }

    const reader = videoFile.stream().getReader();
    let offset = 0;
    const processChunk = ({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
      if (done) {
        setMessage('Finalizing video...');
        mp4boxfile.flush();
        Promise.all([
          videoDecoder.flush(),
          audioDecoder.flush()
        ]).then(() => Promise.all([
          videoEncoder.flush(),
          audioEncoder?.flush()
        ])).then(() => {
          muxer.finalize();
          const { buffer } = muxer.target as ArrayBufferTarget;
          const blob = new Blob([buffer], { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);
          setTrimmedVideoSrc(url);
          setMessage('Done!');
          resolve();
        }).catch(reject);
        return;
      }

      const buffer: any = value.buffer
      buffer.fileStart = offset
      offset += buffer.byteLength
      mp4boxfile.appendBuffer(buffer)
      reader.read().then(processChunk).catch(reject)
    }
    reader.read().then(processChunk).catch(reject)
  });

  const handleTrim = async () => {
    if (!videoFile) return

    setIsLoading(true)
    setMessage('Starting video processing...')

    try {
      await encodeWithWebCodecs()
    } catch (error) {
      console.error(error)
      setMessage(`An error occurred: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UtilsLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Video Cutter/Encoder</h1>

        <div className="space-y-2">
          <Label htmlFor="video-upload">Upload a video</Label>
          <Input id="video-upload" type="file" accept="video/mp4" onChange={handleFileChange} />
        </div>

        {videoSrc && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Original Video</h2>
            <video
              ref={videoRef}
              src={videoSrc}
              controls
              className="w-full rounded"
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
            />

            {duration > 0 && (
              <div className="space-y-2">
                <Label>Trim Range</Label>
                <Slider
                  min={0}
                  max={duration}
                  step={0.1}
                  value={trimValues}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between text-sm">
                  <span>Start: {trimValues[0].toFixed(1)}s</span>
                  <span className='font-semibold'>Current: {currentTime.toFixed(1)}s</span>
                  <span>End: {trimValues[1].toFixed(1)}s</span>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="text-center p-2 bg-gray-100 rounded-md">
                <p>{message}</p>
              </div>
            )}

            <div className="space-y-4 rounded-md border p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="size-limit-checkbox"
                  checked={isSizeLimitEnabled}
                  onCheckedChange={(checked) => setIsSizeLimitEnabled(Boolean(checked))}
                />
                <Label htmlFor="size-limit-checkbox">Limit output file size</Label>
              </div>

              {isSizeLimitEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <Select value={sizeLimitPreset} onValueChange={setSizeLimitPreset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 MB</SelectItem>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                      <SelectItem value="100">100 MB</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {sizeLimitPreset === 'custom' && (
                    <Input
                      type="number"
                      value={customSizeLimit}
                      onChange={(e) => setCustomSizeLimit(e.target.value)}
                      min="1"
                      placeholder="MB"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button onClick={handleTrim} disabled={isLoading || !videoFile}>
                {isLoading ? 'Processing...' : 'Encode Video'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Your video will be re-encoded using the browser's native capabilities.
            </p>
          </div>
        )}

        {trimmedVideoSrc && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Trimmed Video</h2>
            <video src={trimmedVideoSrc} controls className="w-full rounded" />
            <a href={trimmedVideoSrc} download={`trimmed-${videoFile?.name || 'video.mp4'}`}>
              <Button>Download Trimmed Video</Button>
            </a>
          </div>
        )}
      </div>
    </UtilsLayout>
  )
}
