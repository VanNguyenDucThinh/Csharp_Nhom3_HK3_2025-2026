// src/components/layout/PlayerBar.tsx
import { useState, useRef, useEffect } from 'react'
import { usePlayer } from '../../pages/PlayerContext.tsx'

const PlayIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
const PauseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18" rx="1" /><rect x="15" y="3" width="4" height="18" rx="1" /></svg>
const PrevIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="2" height="16" rx="1" /><polygon points="19,4 9,12 19,20" /></svg>
const NextIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="17" y="4" width="2" height="16" rx="1" /><polygon points="5,4 15,12 5,20" /></svg>
const VolumeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
const MutedVolumeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12 19 14.5 20.5 13 18 10.5 20.5 8 19 6.5 16.5 9 14 6.5 12.5 8 15 10.5 12.5 13 14 14.5 16.5 12zM3 9v6h4l5 5V4L7 9H3z"/></svg>
const ShuffleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
const RepeatIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>

export default function PlayerBar() {
  const { currentTrack } = usePlayer()
  const BACKEND_DOMAIN = "http://localhost:5124"

  const fullAudioSrc = currentTrack?.urlMedia
    ? (currentTrack.urlMedia.startsWith("http")
        ? encodeURI(currentTrack.urlMedia)
        : `${BACKEND_DOMAIN}/${encodeURI(currentTrack.urlMedia)}`)
    : ""

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]       = useState(0)
  const [volume, setVolume]           = useState(1)
  const [lastVolume, setLastVolume]   = useState(1)
  const [liked, setLiked]             = useState(false)
  const [shuffle, setShuffle]         = useState(false)
  const [repeat, setRepeat]           = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Lắng nghe sự kiện audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onLoaded = () => setDuration(audio.duration)
    const onTime   = () => setCurrentTime(audio.currentTime)
    const onEnded  = () => setIsPlaying(false)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  // Tự động phát khi có bài mới
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // Reset time khi chuyển bài mới
      setCurrentTime(0)
      setDuration(0)
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }, [currentTrack])

  // Áp dụng âm lượng vào audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play().catch(console.error)
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume)
      setVolume(0)
    } else {
      setVolume(lastVolume > 0 ? lastVolume : 1)
    }
  }

  // ── FIX THANH TIẾN TRÌNH ─────────────────────────────────────
  // Vấn đề cũ: dùng 2 lớp chồng nhau (div progress-fill + input range)
  // khiến chấm tròn của native input không đồng bộ với div fill.
  // Giải pháp: chỉ dùng DUY NHẤT input[type=range] nhưng style bằng CSS
  // thông qua CSS custom property --progress để vẽ fill bằng background gradient.
  // Cách này đảm bảo chấm tròn và fill LUÔN đồng bộ vì cùng 1 element.
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // ── FIX ÂM LƯỢNG ─────────────────────────────────────────────
  // Vấn đề cũ: dùng onPointerDown + setPointerCapture trên div wrapper
  // khiến input range bên trong không nhận được event đúng cách.
  // Giải pháp: bỏ toàn bộ pointer capture logic, chỉ dùng onChange
  // của input range trực tiếp — đơn giản hơn, hoạt động chắc chắn hơn.
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) setLastVolume(newVolume)
  }

  const volumePercent = volume * 100

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={fullAudioSrc} />

      {/* Phần 1: Thông tin bài hát */}
      <div style={styles.trackSection}>
        <img
          src={currentTrack?.urlImage
            ? (currentTrack.urlImage.startsWith("http")
                ? currentTrack.urlImage
                : `${BACKEND_DOMAIN}/${currentTrack.urlImage}`)
            : "https://picsum.photos/seed/tune/48/48"}
          alt="cover"
          style={styles.cover}
        />
        <div style={styles.trackText}>
          <div style={styles.trackTitle}>{currentTrack?.title || "Chưa có bài hát"}</div>
          <div style={styles.trackArtist}>{currentTrack?.artist || "Hãy chọn một bài"}</div>
        </div>
        <button
          className="btn-icon"
          onClick={() => setLiked(!liked)}
          title={liked ? 'Bỏ yêu thích' : 'Yêu thích'}
          style={{ color: liked ? '#1DB954' : '#b3b3b3', flexShrink: 0 }}
        >
          {liked ? '💚' : '🤍'}
        </button>
      </div>

      {/* Phần 2: Điều khiển + thanh tiến trình */}
      <div style={styles.centerSection}>
        <div style={styles.controlRow}>
          <button className="btn-icon" onClick={() => setShuffle(!shuffle)} style={{ color: shuffle ? '#1DB954' : '#b3b3b3' }}>
            <ShuffleIcon />
          </button>
          <button className="btn-icon"><PrevIcon /></button>
          <button className="btn-play" onClick={togglePlay}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="btn-icon"><NextIcon /></button>
          <button className="btn-icon" onClick={() => setRepeat(!repeat)} style={{ color: repeat ? '#1DB954' : '#b3b3b3' }}>
            <RepeatIcon />
          </button>
        </div>

        {/* Thanh tiến trình — dùng 1 input range duy nhất, fill bằng CSS gradient */}
        <div style={styles.progressRow}>
          <span style={styles.time}>{formatTime(currentTime)}</span>
          <div className="progress-wrapper" style={{ flex: 1 }}>
            <input
              type="range"
              className="progress-input-seek"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              // CSS custom property để vẽ fill gradient đồng bộ với value
              style={{
                '--progress': `${progressPercent}%`,
              } as React.CSSProperties}
            />
          </div>
          <span style={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Phần 3: Âm lượng — dùng input range trực tiếp */}
      <div style={styles.volumeSection}>
        <button
          className="btn-icon"
          onClick={toggleMute}
          style={{ color: '#fff', flexShrink: 0 }}
        >
          {volume > 0 ? <VolumeIcon /> : <MutedVolumeIcon />}
        </button>
        {/* Input range âm lượng — onChange trực tiếp, không cần pointer capture */}
        <div className="progress-wrapper volume-slider" style={{ width: 112, flex: '0 0 112px' }}>
          <input
            type="range"
            className="progress-input-seek"
            min={0}
            max={1}
            step={0.02}
            value={volume}
            onChange={handleVolumeChange}
            style={{
              '--progress': `${volumePercent}%`,
            } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container:     { backgroundColor: '#181818', height: '100%', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 16 },
  trackSection:  { display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 0', minWidth: 180, maxWidth: 350 },
  cover:         { width: 48, height: 48, borderRadius: 4, flexShrink: 0 },
  trackText:     { minWidth: 0, flex: 1, overflow: 'hidden' },
  trackTitle:    { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  trackArtist:   { fontSize: 12, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  centerSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: '2 1 0', maxWidth: 720, minWidth: 240 },
  controlRow:    { display: 'flex', alignItems: 'center', gap: 8 },
  progressRow:   { display: 'flex', alignItems: 'center', gap: 10, width: '100%' },
  time:          { fontSize: 11, color: '#b3b3b3', fontFamily: 'monospace', minWidth: 38, textAlign: 'center', flexShrink: 0 },
  volumeSection: { display: 'flex', alignItems: 'center', gap: 6, flex: '1 1 0', maxWidth: 220, minWidth: 150, justifyContent: 'flex-end' },
}