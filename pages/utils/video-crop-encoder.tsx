'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import UtilsLayout from '@/components/layout/UtilsLayout'

export default function VideoCropEncoder() {
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
  const ffmpegRef = useRef<FFmpeg | null>(null)

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
      // Seek the video to the thumb that was moved
      if (newStart !== oldStart) {
        videoRef.current.currentTime = newStart
      } else if (newEnd !== oldEnd) {
        videoRef.current.currentTime = newEnd
      }
    }
  }

  const handleTrim = async (mode: 'fast' | 'slow') => {
    if (!videoFile) return

    setIsLoading(true)
    setMessage('Loading FFmpeg core...')
    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg()
    }
    const ffmpeg = ffmpegRef.current
    try {
      if (!ffmpeg.loaded) {
        await ffmpeg.load()
      }

      setMessage('Writing file to FFmpeg...')
      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))

      const [start, end] = trimValues
      const trimDuration = end - start

      let command: string[]
      if (mode === 'fast' && !isSizeLimitEnabled) {
        setMessage('Trimming video (fast mode)...')
        command = ['-i', 'input.mp4', '-ss', `${start}`, '-to', `${end}`, '-c', 'copy', 'output.mp4']
      } else if (isSizeLimitEnabled) {
        setMessage('Encoding video with size limit...')

        const targetSizeMB = sizeLimitPreset === 'custom'
          ? parseFloat(customSizeLimit)
          : parseFloat(sizeLimitPreset)

        if (isNaN(targetSizeMB) || targetSizeMB < 1) {
          setMessage('Invalid size limit. Must be at least 1 MB.')
          setIsLoading(false)
          return
        }

        const targetSizeBytes = targetSizeMB * 1024 * 1024
        const totalBitrate = (targetSizeBytes * 8) / trimDuration
        const audioBitrate = 128 * 1024 // 128 kbps
        const videoBitrate = totalBitrate - audioBitrate

        if (videoBitrate <= 0) {
          setMessage('Target size is too small for the selected duration. Please choose a larger size or shorter duration.')
          setIsLoading(false)
          return
        }

        const videoBitrateK = Math.floor(videoBitrate / 1024)

        command = [
          '-i', 'input.mp4',
          '-ss', `${start}`,
          '-to', `${end}`,
          '-c:v', 'libx264',
          '-b:v', `${videoBitrateK}k`,
          '-maxrate', `${videoBitrateK}k`,
          '-bufsize', `${videoBitrateK * 2}k`,
          '-c:a', 'aac',
          '-b:a', '128k',
          'output.mp4'
        ]
      } else {
        setMessage('Trimming video (precise mode)...')
        command = ['-i', 'input.mp4', '-ss', `${start}`, '-to', `${end}`, '-c:v', 'libx264', '-preset', 'ultrafast', '-c:a', 'aac', 'output.mp4']
      }

      await ffmpeg.exec(command)

      setMessage('Reading result...')
    const data = (await ffmpeg.readFile('output.mp4')) as Uint8Array
    const blob = new Blob([data], { type: 'video/mp4' })
    const url = URL.createObjectURL(blob)
    setTrimmedVideoSrc(url)
    setMessage('Done!')
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
        <h1 className="text-2xl font-bold">Video Crop/Encoder</h1>

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
                  onCheckedChange={setIsSizeLimitEnabled}
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
              {!isSizeLimitEnabled && (
                <Button onClick={() => handleTrim('fast')} disabled={isLoading || !videoFile}>
                  {isLoading ? 'Processing...' : 'Fast Trim'}
                </Button>
              )}
              <Button onClick={() => handleTrim('slow')} disabled={isLoading || !videoFile} variant="secondary">
                {isLoading ? 'Processing...' : isSizeLimitEnabled ? 'Encode' : 'Precise Trim'}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {isSizeLimitEnabled
                ? 'Encoding will be slower but will target the selected file size.'
                : "'Fast Trim' is quicker but may fail on some videos. If you experience issues (like audio only), use 'Precise Trim'."}
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
