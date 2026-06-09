// src/components/layout/PlayerBar.tsx
import { useState, useRef, useEffect } from 'react'

export default function PlayerBar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const sampleAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  // Hàm biến đổi giây thành định dạng Phút:Giây (mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00'
    const minutes = Math.floor(secs / 60)
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    return `${returnedMinutes}:${returnedSeconds}`
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => console.log("Audio play error: ", err))
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

// Tự động lắng nghe sự kiện của thẻ audio để cập nhật lại thời lượng bài hát một cách chính xác
useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioDuration = () => setDuration(audio.duration);

    // Lắng nghe khi trình duyệt đã tải đủ thông tin bài nhạc
    audio.addEventListener('loadedmetadata', setAudioDuration);

    // Dọn dẹp (cleanup) sự kiện khi component bị đóng để tránh rò rỉ bộ nhớ
    return () => {
        audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
}, [sampleAudioUrl]); // Mỗi khi đổi bài hát, hiệu ứng này sẽ chạy lại

  return (
    <div style={styles.container}>
      {/* 1. Thông tin bài hát */}
      <div style={styles.trackInfo}>
        <img src="https://picsum.photos/50" alt="Cover" style={{ borderRadius: 4 }} />
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 14 }}>SoundHelix Song 1</div>
          <div style={{ color: '#b3b3b3', fontSize: 12 }}>Bản Nhạc Thử Nghiệm</div>
        </div>
      </div>

      {/* 2. Bộ điều khiển nhạc và hiển thị thời gian chuẩn Spotify */}
      <div style={styles.controls}>
        <audio 
          ref={audioRef} 
          src={sampleAudioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
        <button onClick={togglePlay} style={styles.playButton}>
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div style={styles.progressBarContainer}>
          {/* Thời gian hiện tại */}
          <span style={styles.time}>{formatTime(currentTime)}</span>
          
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) audioRef.current.currentTime = Number(e.target.value)
            }}
            style={styles.progressBar} 
          />
          
          {/* Thời gian tổng kết thúc */}
          <span style={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Âm lượng */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', width: '30%' }}>
        <span>🔊</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          onChange={(e) => {
            if (audioRef.current) audioRef.current.volume = Number(e.target.value)
          }}
          style={{ width: 80, accentColor: '#1DB954' }} 
        />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { backgroundColor: '#181818', height: '100%', borderTop: '1px solid #282828', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' },
  trackInfo: { display: 'flex', alignItems: 'center', gap: 12, width: '30%' },
  controls: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '40%' },
  playButton: { backgroundColor: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14, fontWeight: 'bold' },
  progressBarContainer: { display: 'flex', width: '100%', alignItems: 'center', gap: 12 },
  progressBar: { flex: 1, accentColor: '#1DB954', cursor: 'pointer' },
  time: { color: '#b3b3b3', fontSize: 12, fontFamily: 'monospace', minWidth: 40 }
}