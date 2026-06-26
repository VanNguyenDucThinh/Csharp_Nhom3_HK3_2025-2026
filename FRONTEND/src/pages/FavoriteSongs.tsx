// src/pages/FavoriteSongs.tsx
import { useEffect, useState } from "react";
import apiClient from "../api/apiClient.ts";
import type { MediaDto } from "../types/Media.ts";
import { Category } from "../types/Media.ts";
import { ErrorMessage } from "../components/layout/ErrorMessage.tsx";
import { LoadingSpinner } from "../components/layout/Loadingspinner.tsx";
import { usePlayer } from "./PlayerContext.tsx";

export default function FavoriteSongs() {
  const [favoriteTracks, setFavoriteTracks] = useState<MediaDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { playTrack } = usePlayer();

  const loadFavorites = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      // Gọi API lấy danh sách yêu thích
      const favorites = await apiClient.media.getFavorites();
      setFavoriteTracks(favorites || []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải danh sách yêu thích.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);


  const handlePlay = async (track: MediaDto) => {
    try {
      let data;
      // Kiểm tra mediaStyle: 1 là Video, khác 1 là Audio
      if (track.mediaStyle === 1) {
        data = await apiClient.media.getVideo(track.id);
      } else {
        data = await apiClient.media.getById(track.id);
      }
      
      // Xử lý dữ liệu trả về (nếu backend bọc trong {data: ...})
      const finalData = (data as any).data?.data || (data as any).data || data;
      
      // Đẩy vào context để phát
      playTrack({ 
        ...finalData, 
        id: track.id, 
        isFavorite: true,
        mediaStyle: track.mediaStyle 
      });
    } catch (err) {
      console.error("Không thể phát bài này:", err);
      setErrorMessage("Không thể tải thông tin bài hát/video này.");
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Danh sách yêu thích</h1>
        <p style={styles.subtitle}>Những bài hát bạn đã "thả tim".</p>
      </header>

      {isLoading && <LoadingSpinner />}
      {!isLoading && errorMessage && <ErrorMessage message={errorMessage} onRetry={loadFavorites} />}

      {!isLoading && !errorMessage && (
        <div style={styles.tableWrapper}>
          {favoriteTracks.length === 0 ? (
            <div style={styles.emptyState}>Chưa có bài hát nào trong danh sách.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Tiêu đề</th>
                  <th style={styles.th}>Nghệ sĩ</th>
                  <th style={styles.th}>Loại</th>
                </tr>
              </thead>
              <tbody>
                {favoriteTracks.map((track, idx) => (
                  <tr
                    key={track.id}
                    onClick={() => handlePlay(track)}
                    style={styles.row}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={styles.td}>{idx + 1}</td>
                    <td style={styles.td}>
                      <div style={styles.trackName}>
                        <div style={styles.coverThumbnail}>
                          {track.urlImage ? (
                            <img src={track.urlImage} alt="cover" style={styles.img} />
                          ) : "🎵"}
                        </div>
                        {track.title}
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: '#b3b3b3' }}>{track.artist}</td>
                    <td style={{ ...styles.td, color: '#b3b3b3' }}>{Category[track.category]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 700, marginBottom: 8 },
  subtitle: { color: '#b3b3b3' },
  tableWrapper: { backgroundColor: '#121212', borderRadius: 8, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { borderBottom: '1px solid #282828' },
  th: { padding: '12px 16px', textAlign: 'left', color: '#b3b3b3', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  row: { borderBottom: '1px solid #1a1a1a', cursor: 'pointer', transition: 'background-color 0.2s' },
  td: { padding: '12px 16px', fontSize: 14 },
  trackName: { display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 },
  coverThumbnail: {
    width: 40, height: 40, borderRadius: 4, backgroundColor: '#282828',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 },
  emptyState: { padding: '40px', textAlign: 'center', color: '#b3b3b3' }
};