// src/components/layout/PlayerBar.tsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
)
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="3" width="4" height="18" rx="1" /><rect x="15" y="3" width="4" height="18" rx="1" />
  </svg>
)
const PrevIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="4" width="2" height="16" rx="1" /><polygon points="19,4 9,12 19,20" />
  </svg>
)
const NextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="17" y="4" width="2" height="16" rx="1" /><polygon points="5,4 15,12 5,20" />
  </svg>
)
const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
  </svg>
)
const ShuffleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
  </svg>
)
const RepeatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
  </svg>
)
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#1DB954' : 'none'} stroke={filled ? '#1DB954' : 'currentColor'} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [liked, setLiked] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const navigate = useNavigate()

  const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  const clamp = useCallback((value: number, min: number, max: number) => Math.min(Math.max(value, min), max), [])

  const isEditableTarget = useCallback((target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName.toLowerCase()
    return target.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select'
  }, [])

  const focusSearchInput = useCallback(() => {
    window.setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('[data-shortcut="search-input"]')
      input?.focus()
    }, 0)
  }, [])

  const seekBy = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration)) return
    const nextTime = clamp(audio.currentTime + seconds, 0, audio.duration)
    audio.currentTime = nextTime
    setCurrentTime(nextTime)
  }, [clamp])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play().catch(console.error)
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const formatTime = useCallback((secs: number) => {
    if (!secs || isNaN(secs)) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }, [])

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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return

      const isSpace = event.code === 'Space' || event.key === ' '
      const isLeft = event.key === 'ArrowLeft'
      const isRight = event.key === 'ArrowRight'
      const isVolumeUp = event.key === 'ArrowUp'
      const isVolumeDown = event.key === 'ArrowDown'
      const isSearch = event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey

      if (isSpace) {
        event.preventDefault()
        if (!event.repeat) togglePlay()
        return
      }

      if (isLeft || isRight) {
        event.preventDefault()
        seekBy(isRight ? 5 : -5)
        return
      }

      if (isVolumeUp || isVolumeDown) {
        event.preventDefault()
        setVolume(prevVolume => clamp(prevVolume + (isVolumeUp ? 0.05 : -0.05), 0, 1))
        return
      }

      if (isSearch) {
        event.preventDefault()
        navigate('/search')
        focusSearchInput()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [clamp, focusSearchInput, isEditableTarget, navigate, seekBy, togglePlay])

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={sampleAudioUrl} />

      {/* 1. Track info + like */}
      <div style={styles.trackSection}>
        <img
          src="https://picsum.photos/seed/tune/48/48"
          alt="cover"
          style={styles.cover}
        />
        <div style={styles.trackText}>
          <div style={styles.trackTitle}>SoundHelix Song 1</div>
          <div style={styles.trackArtist}>Bản Nhạc Thử Nghiệm</div>
        </div>
        <button
          className="btn-icon"
          onClick={() => setLiked(!liked)}
          title={liked ? 'Bỏ yêu thích' : 'Yêu thích'}
          style={{ color: liked ? '#1DB954' : '#b3b3b3' }}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      {/* 2. Controls + Progress */}
      <div style={styles.centerSection}>
        {/* Nút điều khiển */}
        <div style={styles.controlRow}>
          <button
            className="btn-icon"
            onClick={() => setShuffle(!shuffle)}
            title="Phát ngẫu nhiên"
            style={{ color: shuffle ? '#1DB954' : '#b3b3b3' }}
          >
            <ShuffleIcon />
          </button>
          <button className="btn-icon" title="Bài trước">
            <PrevIcon />
          </button>
          <button className="btn-play" onClick={togglePlay} title={isPlaying ? 'Dừng' : 'Phát'}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="btn-icon" title="Bài tiếp theo">
            <NextIcon />
          </button>
          <button
            className="btn-icon"
            onClick={() => setRepeat(!repeat)}
            title="Lặp lại"
            style={{ color: repeat ? '#1DB954' : '#b3b3b3' }}
          >
            <RepeatIcon />
          </button>
        </div>

        {/* Thanh tiến trình */}
        <div style={styles.progressRow}>
          <span style={styles.time}>{formatTime(currentTime)}</span>
          <div className="progress-wrapper">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
                <div className="progress-thumb" />
              </div>
            </div>
            <input
              type="range"
              className="progress-input"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={e => {
                const val = Number(e.target.value)
                if (audioRef.current) audioRef.current.currentTime = val
                setCurrentTime(val)
              }}
            />
          </div>
          <span style={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Volume */}
      <div style={styles.volumeSection}>
        <button className="btn-icon" title="Âm lượng">
          <VolumeIcon />
        </button>
        <div className="progress-wrapper" style={{ width: 90 }}>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${volume * 100}%` }}>
              <div className="progress-thumb" />
            </div>
          </div>
          <input
            type="range"
            className="progress-input"
            min={0} max={1} step={0.02}
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
          />
        </div>
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
    padding: '0 16px',
    gap: 16,
  },
  trackSection: {
    display: 'flex', alignItems: 'center',
    gap: 12, flex: '0 0 30%', minWidth: 0,
  },
  cover: { width: 48, height: 48, borderRadius: 4, flexShrink: 0 },
  trackText: { minWidth: 0, flex: 1 },
  trackTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  trackArtist: { fontSize: 12, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  centerSection: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 6,
    flex: '0 0 40%',
  },
  controlRow: { display: 'flex', alignItems: 'center', gap: 8 },
  progressRow: { display: 'flex', alignItems: 'center', gap: 10, width: '100%' },
  time: { fontSize: 11, color: '#b3b3b3', fontFamily: 'monospace', minWidth: 38, textAlign: 'center' },
  volumeSection: {
    display: 'flex', alignItems: 'center',
    gap: 6, flex: '0 0 30%', justifyContent: 'flex-end',
  },
}