// src/components/layout/PlayerBar.tsx
import { useState, useRef, useEffect } from 'react'

// Icon play/t pause
const PlayIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="5" y="3" width="4" height="18" rx="1" /><rect x="15" y="3" width="4" height="18" rx="1" />
  </svg>
)

// Icon điều hướng bài hát
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

// Icon âm lượng - có 2 trạng thái: bật và tắt
const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
  </svg>
)
const MutedVolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12 19 14.5 20.5 13 18 10.5 20.5 8 19 6.5 16.5 9 14 6.5 12.5 8 15 10.5 12.5 13 14 14.5 16.5 12zM3 9v6h4l5 5V4L7 9H3z"/>
  </svg>
)

// Icon chức năng phát nhạc
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

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1) // Âm lượng mặc định max để khớp Spotify.
  const [lastVolume, setLastVolume] = useState(1) // Lưu âm lượng trước khi tắt tiếng để khôi phục khi cần.
  const [isDraggingVolume, setIsDraggingVolume] = useState(false)
  const [liked, setLiked] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)
  const isDraggingVolumeRef = useRef(false)

  const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  // Định dạng thời gian bài hát thành dạng mm:ss để hiển thị dễ đọc.
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '00:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  // Lắng nghe sự kiện audio để cập nhật thời gian phát thực tế.
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

  // Áp dụng âm lượng cho audio element mỗi khi state volume thay đổi.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Chuyển đổi trạng thái play/pause khi người dùng bấm nút phát.
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play().catch(console.error)
    setIsPlaying(!isPlaying)
  }

  // Bật/tắt âm thanh: nếu đang có tiếng thì tắt, nếu đang muted thì trở lại max.
  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume)
      setVolume(0)
    } else {
      setLastVolume(1)
      setVolume(1)
    }
  }

  // Cập nhật âm lượng khi kéo thanh hoặc bấm vào track.
  const handleVolumeChange = (value: number) => {
    const safeValue = Math.min(Math.max(value, 0), 1)
    if (safeValue > 0) setLastVolume(safeValue)
    setVolume(safeValue)
  }

  // Tính tọa độ chuột trong thanh volume rồi đổi thành phần trăm 0-1.
  const updateVolumeFromPointer = (clientX: number) => {
    const element = volumeRef.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    handleVolumeChange(ratio)
  }

  // Khi người dùng bấm vào thanh volume, cập nhật ngay giá trị và cho phép kéo tiếp.
  const handleVolumePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    isDraggingVolumeRef.current = true
    setIsDraggingVolume(true)
    updateVolumeFromPointer(event.clientX)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  // Khi người dùng kéo chuột trên thanh volume, cập nhật âm lượng theo vị trí mới.
  const handleVolumePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingVolumeRef.current) return
    updateVolumeFromPointer(event.clientX)
  }

  // Khi thả chuột, kết thúc trạng thái kéo để thanh trở lại màu trắng nếu chưa hover.
  const handleVolumePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    isDraggingVolumeRef.current = false
    setIsDraggingVolume(false)
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // Một số trình duyệt có thể đã tự thả pointer, bỏ qua lỗi nhỏ này.
    }
  }

  // Tính phần trăm tiến trình bài hát để vẽ thanh progress.
  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={sampleAudioUrl} />

      {/* Phần 1: Thông tin bài hát + nút yêu thích */}
      <div style={styles.trackSection}>
        <img src="https://picsum.photos/seed/tune/48/48" alt="cover" style={styles.cover} />
        <div style={styles.trackText}>
          <div style={styles.trackTitle}>SoundHelix Song 1</div>
          <div style={styles.trackArtist}>Bản Nhạc Thử Nghiệm</div>
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
          <button className="btn-icon" onClick={() => setShuffle(!shuffle)} title="Phát ngẫu nhiên" style={{ color: shuffle ? '#1DB954' : '#b3b3b3' }}>
            <ShuffleIcon />
          </button>
          <button className="btn-icon" title="Bài trước"><PrevIcon /></button>
          <button className="btn-play" onClick={togglePlay} title={isPlaying ? 'Dừng' : 'Phát'}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="btn-icon" title="Bài tiếp theo"><NextIcon /></button>
          <button className="btn-icon" onClick={() => setRepeat(!repeat)} title="Lặp lại" style={{ color: repeat ? '#1DB954' : '#b3b3b3' }}>
            <RepeatIcon />
          </button>
        </div>

        <div style={styles.progressRow}>
          <span style={styles.time}>{formatTime(currentTime)}</span>
          <div className="progress-wrapper">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
                <div className="progress-thumb" />
              </div>
            </div>
            <input
              type="range" className="progress-input"
              min={0} max={duration || 100} value={currentTime}
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

      {/* Phần 3: Âm lượng Spotify-style */}
      <div style={styles.volumeSection}>
        <button
          className="btn-icon"
          title={volume > 0 ? 'Tắt tiếng' : 'Bật tiếng'}
          onClick={toggleMute}
          style={{ color: '#fff', flexShrink: 0 }}
        >
          {volume > 0 ? <VolumeIcon /> : <MutedVolumeIcon />}
        </button>
        <div
          ref={volumeRef}
          className={'progress-wrapper volume-slider ' + (isDraggingVolume ? 'active-volume' : '')}
          style={{ width: 112, flexGrow: 0, flexShrink: 0 }}
          onPointerDown={handleVolumePointerDown}
          onPointerMove={handleVolumePointerMove}
          onPointerUp={handleVolumePointerUp}
          onPointerCancel={handleVolumePointerUp}
        >
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${volume * 100}%` }}>
              <div className="progress-thumb" />
            </div>
          </div>
          <input
            type="range" className="progress-input"
            min={0} max={1} step={0.02} value={volume}
            onChange={e => handleVolumeChange(Number(e.target.value))}
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
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: 16,
  },
  trackSection: {
    display: 'flex', alignItems: 'center', gap: 12,
    flex: '1 1 0', minWidth: 180, maxWidth: 350,
  },
  cover: { width: 48, height: 48, borderRadius: 4, flexShrink: 0 },
  trackText: { minWidth: 0, flex: 1, overflow: 'hidden' },
  trackTitle: { fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  trackArtist: { fontSize: 12, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  centerSection: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    flex: '2 1 0', maxWidth: 720, minWidth: 240,
  },
  controlRow: { display: 'flex', alignItems: 'center', gap: 8 },
  progressRow: { display: 'flex', alignItems: 'center', gap: 10, width: '100%' },
  time: { fontSize: 11, color: '#b3b3b3', fontFamily: 'monospace', minWidth: 38, textAlign: 'center', flexShrink: 0 },
  volumeSection: {
    display: 'flex', alignItems: 'center', gap: 6,
    flex: '1 1 0', maxWidth: 220, minWidth: 150,
    justifyContent: 'flex-end',
  },
}
