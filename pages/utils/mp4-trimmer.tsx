'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export default function Mp4Trimmer() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoSrc, setVideoSrc] = useState<string>('')
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState<string>('')
  const [duration, setDuration] = useState<number>(0)
  const [trimValues, setTrimValues] = useState<[number, number]>([0, 0])
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
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

  const handleTrim = async () => {
    if (!videoFile) return

    setIsLoading(true)
    setMessage('Loading FFmpeg core...')
    if (!ffmpegRef.current) {
      ffmpegRef.current = new FFmpeg()
    }
    const ffmpeg = ffmpegRef.current
    try {
      await ffmpeg.load()

      setMessage('Writing file to FFmpeg...')
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))

    const [start, end] = trimValues

    setMessage('Trimming video...')
    await ffmpeg.exec(['-i', 'input.mp4', '-ss', `${start}`, '-to', `${end}`, '-c', 'copy', 'output.mp4'])

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
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">MP4 Video Trimmer</h1>

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

          <Button onClick={handleTrim} disabled={isLoading || !videoFile}>
            {isLoading ? 'Processing...' : 'Trim Video'}
          </Button>
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
  )
}
