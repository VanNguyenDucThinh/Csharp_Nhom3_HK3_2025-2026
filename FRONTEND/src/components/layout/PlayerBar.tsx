// src/components/layout/PlayerBar.tsx
import { useState, useRef, useEffect } from 'react'

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="3" width="4" height="18" rx="1" />
    <rect x="15" y="3" width="4" height="18" rx="1" />
  </svg>
)

const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
  </svg>
)

// Prev: tam giác nhỏ bên trái + vạch đứng bên trái
const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="4" width="2" height="16" rx="1" />
    <polygon points="19,4 9,12 19,20" />
  </svg>
)

// Next: tam giác nhỏ bên phải + vạch đứng bên phải
const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="17" y="4" width="2" height="16" rx="1" />
    <polygon points="5,4 15,12 5,20" />
  </svg>
)

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement>(null)

  const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onLoaded = () => setDuration(audio.duration)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={sampleAudioUrl} />

      {/* 1. Thông tin bài hát */}
      <div style={styles.trackInfo}>
        <img
          src="https://picsum.photos/seed/tune/48/48"
          alt="cover"
          style={{ width: 48, height: 48, borderRadius: 4, display: 'block', flexShrink: 0 }}
        />
        <div>
          <div style={styles.trackTitle}>SoundHelix Song 1</div>
          <div style={styles.trackArtist}>Bản Nhạc Thử Nghiệm</div>
        </div>
      </div>

      {/* 2. Controls + Thanh tiến trình */}
      <div style={styles.centerSection}>
        <div style={styles.buttons}>
          <button style={styles.sideBtn} title="Bài trước">
            <PrevIcon />
          </button>
          <button style={styles.playBtn} onClick={togglePlay} title={isPlaying ? 'Dừng' : 'Phát'}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button style={styles.sideBtn} title="Bài tiếp theo">
            <NextIcon />
          </button>
        </div>

        <div style={styles.progressRow}>
          <span style={styles.time}>{formatTime(currentTime)}</span>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={e => {
                const val = Number(e.target.value)
                if (audioRef.current) audioRef.current.currentTime = val
                setCurrentTime(val)
              }}
              style={styles.progressInput}
            />
          </div>
          <span style={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Âm lượng */}
      <div style={styles.volumeSection}>
        <VolumeIcon />
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={styles.volumeSlider}
        />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#181818',
    height: '100%',
    borderTop: '1px solid #282828',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    gap: 16,
  },
  trackInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: '0 0 30%',
    minWidth: 0,
  },
  trackTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 },
  trackArtist: { fontSize: 12, color: '#b3b3b3' },
  centerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    flex: '0 0 40%',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  playBtn: {
    backgroundColor: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#000',
    flexShrink: 0,
  },
  sideBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#b3b3b3',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 4,
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#404040',
    borderRadius: 2,
    position: 'relative',
    cursor: 'pointer',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 2,
    pointerEvents: 'none',
  },
  progressInput: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    margin: 0,
  },
  time: {
    fontSize: 11,
    color: '#b3b3b3',
    fontFamily: 'monospace',
    minWidth: 38,
    textAlign: 'center',
  },
  volumeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: '0 0 30%',
    justifyContent: 'flex-end',
    color: '#b3b3b3',
  },
  volumeSlider: {
    width: 90,
    accentColor: '#1DB954',
    cursor: 'pointer',
  },
}