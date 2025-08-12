'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

export default function Mp4Trimmer() {
  const [videoSrc, setVideoSrc] = useState('')
  const [trimmedVideoSrc, setTrimmedVideoSrc] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [startTime, setStartTime] = useState('00:00:00')
  const [endTime, setEndTime] = useState('00:00:00')
  const [isTrimming, setIsTrimming] = useState(false)
  const [progress, setProgress] = useState(0)
  const ffmpegRef = useRef(new FFmpeg())
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadFFmpeg = async () => {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
      const ffmpeg = ffmpegRef.current
      ffmpeg.on('log', ({ message }) => {
        console.log(message)
      })
      ffmpeg.on('progress', ({ progress }) => {
        setProgress(Math.round(progress * 100))
      })
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      })
    }
    loadFFmpeg()
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setVideoSrc(URL.createObjectURL(file))
    }
  }

  const handleTrim = async () => {
    if (!videoFile) return

    setIsTrimming(true)
    setTrimmedVideoSrc('')
    setProgress(0)

    const ffmpeg = ffmpegRef.current
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))

    const command = [
      '-i',
      'input.mp4',
      '-ss',
      startTime,
      '-to',
      endTime,
      '-c',
      'copy',
      'output.mp4',
    ]

    await ffmpeg.exec(command)

    const data = await ffmpeg.readFile('output.mp4')
    if (data && typeof (data as Uint8Array).buffer !== 'undefined') {
      const blob = new Blob([(data as Uint8Array).buffer], { type: 'video/mp4' })
      setTrimmedVideoSrc(URL.createObjectURL(blob))
    }

    setIsTrimming(false)
  }

  const setCurrentTimeAsStart = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const hours = Math.floor(currentTime / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((currentTime % 3600) / 60).toString().padStart(2, '0');
      const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
      setStartTime(`${hours}:${minutes}:${seconds}`);
    }
  }

  const setCurrentTimeAsEnd = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const hours = Math.floor(currentTime / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((currentTime % 3600) / 60).toString().padStart(2, '0');
      const seconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
      setEndTime(`${hours}:${minutes}:${seconds}`);
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">MP4 Trimmer</h1>
      <div className="space-y-2">
        <Label htmlFor="video-upload">Upload Video</Label>
        <Input id="video-upload" type="file" accept="video/mp4" onChange={handleFileChange} />
      </div>

      {videoSrc && (
        <div>
          <h2 className="text-xl font-semibold">Original Video</h2>
          <video ref={videoRef} src={videoSrc} controls className="w-full max-w-lg"></video>
          <div className="flex space-x-2 mt-2">
            <Button onClick={setCurrentTimeAsStart}>Set Start Time</Button>
            <Button onClick={setCurrentTimeAsEnd}>Set End Time</Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-time">Start Time</Label>
          <Input id="start-time" type="text" value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="hh:mm:ss" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-time">End Time</Label>
          <Input id="end-time" type="text" value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="hh:mm:ss" />
        </div>
      </div>

      <Button onClick={handleTrim} disabled={!videoFile || isTrimming}>
        {isTrimming ? `Trimming... ${progress}%` : 'Trim Video'}
      </Button>

      {isTrimming && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {trimmedVideoSrc && (
        <div>
          <h2 className="text-xl font-semibold">Trimmed Video</h2>
          <video src={trimmedVideoSrc} controls className="w-full max-w-lg"></video>
          <a href={trimmedVideoSrc} download={`trimmed-${videoFile?.name || 'video.mp4'}`}>
            <Button>Download Trimmed Video</Button>
          </a>
        </div>
      )}
    </div>
  )
}
