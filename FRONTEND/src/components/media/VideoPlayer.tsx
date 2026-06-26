// src/components/media/VideoPlayer.tsx
import { useRef, useState, useEffect } from 'react'

interface Props {
  src: string
  title?: string
  posterUrl?: string
  autoPlay?: boolean
}

export default function VideoPlayer({ src, title = 'Video', posterUrl, autoPlay = false }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onLoaded = () => setDuration(video.duration)
    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onEnded = () => setIsPlaying(false)
    video.addEventListener('loadedmetadata', onLoaded)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [src])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (videoRef.current) videoRef.current.currentTime = val
    setCurrentTime(val)
  }

  const handleFullscreen = () => {
    videoRef.current?.requestFullscreen()
  }

  return (
    <div
      style={styles.wrapper}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Tiêu đề */}
      <div style={styles.title}>{title}</div>

      {/* Video element */}
      <div style={styles.videoBox} onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          poster={posterUrl}
          autoPlay={autoPlay}
          style={styles.video}
        />
        {/* Overlay nút play khi dừng */}
        {!isPlaying && (
          <div style={styles.overlay}>
            <span style={styles.bigPlay}>▶</span>
          </div>
        )}
      </div>

      {/* Controls thanh dưới */}
      {showControls && (
        <div style={styles.controls}>
          <button onClick={togglePlay} style={styles.btn}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          <span style={styles.time}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            style={styles.slider}
          />
          <span style={styles.time}>{formatTime(duration)}</span>
          <button onClick={handleFullscreen} style={styles.btn}>⛶</button>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { backgroundColor: '#000', borderRadius: 8, overflow: 'hidden', maxWidth: 800 },
  title: { padding: '10px 16px', color: '#fff', fontSize: 14, fontWeight: 600, backgroundColor: '#181818' },
  videoBox: { position: 'relative', cursor: 'pointer', backgroundColor: '#000' },
  video: { width: '100%', display: 'block', maxHeight: 450 },
  overlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  bigPlay: { fontSize: 56, color: 'rgba(255,255,255,0.9)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' },
  controls: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', backgroundColor: '#181818' },
  btn: { backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: 16, cursor: 'pointer', padding: '4px 8px' },
  slider: { flex: 1, accentColor: '#1DB954', cursor: 'pointer' },
  time: { fontSize: 11, color: '#b3b3b3', fontFamily: 'monospace', minWidth: 35 },
}