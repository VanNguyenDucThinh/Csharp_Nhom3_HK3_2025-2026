// src/components/media/AudioPlayer.tsx
import { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../../pages/PlayerContext.tsx'; // Kết nối với trạm phát sóng

export default function AudioPlayer() {
  // Lấy thông tin bài hát hiện tại từ Global State
  const { currentTrack } = usePlayer();
  console.log("0. [AudioPlayer] Đang bắt sóng, currentTrack hiện tại là:", currentTrack);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Lắng nghe sự kiện của thẻ audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);
    
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]); // Reset lại event khi đổi bài

  // Xử lý thay đổi âm lượng
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Tự động Tải, Phát nhạc và đổi nút sang "⏸" khi có bài hát mới được truyền vào
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // Ép thẻ audio nạp lại nguồn src mới vừa được cập nhật đầy đủ domain tuyệt đối
      audioRef.current.load();
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.log("Lỗi trình duyệt chặn autoplay:", e));
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrentTime(val);
  };

  // Nếu chưa có bài hát nào được chọn, hiển thị giao diện trống
  if (!currentTrack) {
    return (
      <div style={styles.wrapper}>
        <div style={{ margin: '0 auto', color: '#b3b3b3', fontSize: 14 }}>
          Hãy chọn một bài hát để phát
        </div>
      </div>
    );
  }
  // Khai báo domain của Backend để xử lý đường dẫn tương đối (Relative Path)
  const BACKEND_DOMAIN = "http://localhost:5124";
  console.log("1. Dữ liệu bài hát nhận được:", currentTrack);
  
  // Ghép nối chuỗi hoàn chỉnh để trỏ đúng về cổng của Server API (.NET)
  const fullAudioSrc = currentTrack.urlMedia?.startsWith("http")
    ? currentTrack.urlMedia
    : `${BACKEND_DOMAIN}/${currentTrack.urlMedia}`;

  // Giao diện khi có bài hát
  return (
    <div style={styles.wrapper}>
      {/* Nguồn nhạc thực tế đã được xử lý đường dẫn tuyệt đối */}
      <audio ref={audioRef} src={fullAudioSrc} />

      {/* Cover + Info */}
      <div style={styles.info}>
        {currentTrack.urlImage
          ? <img src={currentTrack.urlImage} alt="cover" style={styles.cover} />
          : <div style={styles.coverPlaceholder}>🎵</div>
        }
        <div>
          <div style={styles.title}>{currentTrack.title}</div>
          <div style={styles.artist}>{currentTrack.artist || 'Nghệ sĩ chưa rõ'}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button onClick={togglePlay} style={styles.playBtn}>
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
      </div>

      {/* Volume */}
      <div style={styles.volume}>
        <span>🔊</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          style={{ width: 70, accentColor: '#1DB954' }}
        />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: { display: 'flex', alignItems: 'center', gap: 16, backgroundColor: '#181818', padding: '12px 20px', borderRadius: 8 },
  info: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 180 },
  cover: { width: 48, height: 48, borderRadius: 4, objectFit: 'cover' },
  coverPlaceholder: { width: 48, height: 48, backgroundColor: '#282828', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  title: { fontSize: 14, fontWeight: 600, color: '#fff' },
  artist: { fontSize: 12, color: '#b3b3b3', marginTop: 2 },
  controls: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
  playBtn: { backgroundColor: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 13, fontWeight: 'bold', flexShrink: 0 },
  slider: { flex: 1, accentColor: '#1DB954', cursor: 'pointer' },
  time: { fontSize: 11, color: '#b3b3b3', fontFamily: 'monospace', minWidth: 35 },
  volume: { display: 'flex', alignItems: 'center', gap: 6 },
};