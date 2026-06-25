// src/components/layout/RightPanel.tsx
import React, { useState, useEffect } from 'react';
import { usePlayer } from '../../pages/PlayerContext.tsx'; 
import apiClient, { showApiError } from '../../api/apiClient.ts'; 

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  );
}

export default function RightPanel({ onClose }: { onClose: () => void }) {
  const { currentTrack, updateCurrentTrack, favIds, toggleFavId } = usePlayer();
  const [isFavorite, setIsFavorite] = useState(false);

  // ĐỒNG BỘ TRẠNG THÁI: Mỗi khi bài hát đổi HOẶC danh sách yêu thích thay đổi
  useEffect(() => {
    if (currentTrack) {
      // Ưu tiên kiểm tra trong favIds (độ chính xác cao nhất)
      const isFav = favIds.has((currentTrack as any).id);
      setIsFavorite(isFav);
    }
  }, [currentTrack, favIds]);

  const handleToggleFavorite = async () => {
    if (!currentTrack) return;
    
    const trackId = (currentTrack as any).id;
    const previousState = isFavorite;

    // Optimistic UI: Đổi trạng thái ngay lập tức
    setIsFavorite(!previousState);

    try {
      if (previousState) {
        await apiClient.media.unfavorite(trackId);
      } else {
        await apiClient.media.favorite(trackId);
      }

      // Cập nhật Context: Tự động thêm/xóa ID trong favIds và cập nhật track
      toggleFavId(trackId);
      updateCurrentTrack({ ...(currentTrack as any), isFavorite: !previousState });
      
    } catch (error) {
      // Rollback nếu API lỗi
      setIsFavorite(previousState);
      showApiError(error);
    }
  };

  if (!currentTrack) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.activeTab}>Đang phát</button>
          <button style={styles.closeBtn} onClick={onClose}><CloseIcon /></button>
        </div>
        <div style={{...styles.body, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b3b3b3'}}>
          Chưa có bài hát nào đang phát
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.activeTab}>Đang phát</button>
        <button style={styles.closeBtn} onClick={onClose} title="Thu gọn">
          <CloseIcon />
        </button>
      </div>

      <div style={styles.body}>
        {currentTrack.urlImage ? (
          <img src={currentTrack.urlImage} alt={currentTrack.title} style={styles.imageCover} />
        ) : (
          <div style={{ ...styles.bigCover, background: 'linear-gradient(135deg, #1e3264, #121212)' }}>
            <span style={styles.bigCoverIcon}>🎵</span>
          </div>
        )}

        <div style={styles.trackInfo}>
          <div>
            <div style={styles.trackTitle}>{currentTrack.title}</div>
            <div style={styles.trackArtist}>{currentTrack.artist}</div>
          </div>
          
          <button 
            style={{ ...styles.likeBtn, color: isFavorite ? '#1DB954' : '#b3b3b3' }} 
            onClick={handleToggleFavorite}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#1DB954" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        <div style={styles.divider} />
        <div style={styles.sectionTitle}>Nghệ sĩ</div>
        <div style={styles.artistBox}>
          <div style={styles.artistAvatar}>🎤</div>
          <div style={styles.artistName}>{currentTrack.artist}</div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { backgroundColor: '#121212', height: '100%', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #282828', width: '300px' },
  header: { display: 'flex', alignItems: 'center', padding: '14px 12px', borderBottom: '1px solid #282828' },
  activeTab: { backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700 },
  closeBtn: { marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' },
  body: { overflowY: 'auto', padding: '16px' },
  imageCover: { width: '100%', aspectRatio: '1', borderRadius: 8, objectFit: 'cover', marginBottom: 16 },
  bigCover: { width: '100%', aspectRatio: '1', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  bigCoverIcon: { fontSize: 64 },
  trackInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  trackTitle: { fontSize: 18, fontWeight: 700, color: '#fff' },
  trackArtist: { fontSize: 14, color: '#b3b3b3' },
  likeBtn: { background: 'transparent', border: 'none', cursor: 'pointer', transition: '0.2s' },
  divider: { height: 1, backgroundColor: '#282828', margin: '20px 0' },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 },
  artistBox: { display: 'flex', alignItems: 'center', gap: 10 },
  artistAvatar: { width: 44, height: 44, borderRadius: '50%', backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  artistName: { fontSize: 14, fontWeight: 700, color: '#fff' },
};