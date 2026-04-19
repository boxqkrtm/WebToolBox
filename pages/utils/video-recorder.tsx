'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UtilsLayout from '@/components/layout/UtilsLayout'
import { useI18n } from '@/lib/i18n/i18nContext'

type RecordingState = 'idle' | 'recording' | 'paused'

const VideoRecorder: React.FC = () => {
  const { t } = useI18n()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const playbackUrlRef = useRef<string | null>(null)

  const cleanupPlaybackUrl = useCallback(() => {
    if (playbackUrlRef.current) {
      URL.revokeObjectURL(playbackUrlRef.current)
      playbackUrlRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const displayMedia = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })

      streamRef.current = displayMedia
      setStream(displayMedia)

      if (videoRef.current) {
        videoRef.current.srcObject = displayMedia
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mpeg'
      const recorder = new MediaRecorder(displayMedia, { mimeType })
      mediaRecorderRef.current = recorder

      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        finishRecording(chunks)
      }

      recorder.start()
      setRecordingState('recording')
      setError(null)

      durationTimerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '녹화 시작 실패')
    }
  }, [])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setRecordingState('paused')
      // Stop the timer while paused
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current)
        durationTimerRef.current = null
      }
    }
  }, [])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setRecordingState('recording')
      // Restart the timer
      durationTimerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state === 'paused') {
        mediaRecorderRef.current.resume()
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause()
            // chunks are already collected via ondataavailable in startRecording
            finishRecording()
          }
        }, 100)
      } else if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop()
        // onstop handler in startRecording will call finishRecording
      }
    }
    setRecordingState('idle')

    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current)
      durationTimerRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    setStream(null)
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const finishRecording = useCallback((chunks?: Blob[]) => {
    const blob = new Blob(chunks || [], { type: 'video/webm' })
    const url = URL.createObjectURL(blob)
    playbackUrlRef.current = url

    // Update the video element src for playback
    if (videoRef.current) {
      videoRef.current.src = url
      videoRef.current.load()
    }

    setRecordedChunks([blob])

    // Auto-download
    const a = document.createElement('a')
    a.href = url
    a.download = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  useEffect(() => {
    return () => {
      cleanupPlaybackUrl()
    }
  }, [])

  const formatDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <UtilsLayout title={t('common.tools.videoRecorder.title')} description={t('common.tools.videoRecorder.description')}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('common.tools.videoRecorder.page.recordingSetup')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive" role="alert">
                {error}
              </div>
            )}

            {/* Duration Timer */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-muted-foreground">{t('common.tools.videoRecorder.page.durationLabel')}</span>
              <span className="text-lg font-mono font-semibold" aria-live="polite" aria-label={t('common.tools.videoRecorder.aria.duration')}>
                {formatDuration(duration)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3">
              {recordingState === 'idle' && !stream && (
                <Button onClick={startRecording} className="bg-destructive hover:bg-destructive/90 text-white">
                  {t('common.tools.videoRecorder.page.start')}
                </Button>
              )}

              {recordingState === 'recording' && (
                <>
                  <Button variant="outline" onClick={pauseRecording}>
                    {t('common.tools.videoRecorder.page.pause')}
                  </Button>
                  <Button variant="destructive" onClick={stopRecording}>
                    {t('common.tools.videoRecorder.page.stop')}
                  </Button>
                </>
              )}

              {recordingState === 'paused' && (
                <>
                  <Button variant="outline" onClick={resumeRecording}>
                    {t('common.tools.videoRecorder.page.resume')}
                  </Button>
                  <Button variant="destructive" onClick={stopRecording}>
                    {t('common.tools.videoRecorder.page.stop')}
                  </Button>
                </>
              )}

              {recordingState === 'idle' && stream && (
                <Button variant="destructive" onClick={stopRecording}>
                  {t('common.tools.videoRecorder.page.stop')}
                </Button>
              )}
            </div>

            {/* Download */}
            {recordedChunks.length > 0 && (
              <div className="space-y-4">
                <video controls src={URL.createObjectURL(new Blob(recordedChunks, { type: 'video/webm' }))} className="w-full rounded-lg border" />
                <Button onClick={() => {
                  const blob = new Blob(recordedChunks, { type: 'video/webm' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }} variant="default">
                  {t('common.tools.videoRecorder.page.download')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UtilsLayout>
  )
}

export default VideoRecorder
