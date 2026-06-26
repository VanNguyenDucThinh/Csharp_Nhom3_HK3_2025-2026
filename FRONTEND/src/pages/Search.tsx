// src/pages/Search.tsx
import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import apiClient, { showApiError } from '../api/apiClient.ts'
import type { MediaDto as MediaItem } from '../types/Media.ts'
import { Category } from '../types/Media.ts'
import { usePlayer } from './PlayerContext.tsx' 

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || ''; 

  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTrendingMode, setIsTrendingMode] = useState(false);
  
  // Dùng Set để lưu ID các bài đã thích (tối ưu hiệu năng so sánh)
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  const { playTrack } = usePlayer();

  // 1. Tải danh sách ID đã thích về ngay khi vào trang
  useEffect(() => {
    const loadFavIds = async () => {
      try {
        const favList = await apiClient.media.getFavorites();
        setFavIds(new Set(favList.map((item: any) => item.id)));
      } catch (err) {
        console.error("Lỗi tải danh sách yêu thích:", err);
      }
    };
    loadFavIds();
  }, []);

  // 2. Lắng nghe từ khóa để gọi API tìm kiếm
  useEffect(() => {
    if (!q.trim()) {
      if (!isTrendingMode) setResults([]);
      return;
    }
    setIsTrendingMode(false);
    
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const data = await apiClient.media.search(q);
        setResults(data.listMedia ?? []);
      } catch (err) {
        showApiError(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [q]);

  const handleGetTrending = async () => {
    navigate('/search');
    setIsTrendingMode(true);
    setLoading(true);
    try {
      const response = await apiClient.media.trend();
      const trendingData = (response as any).data?.listTrending || (response as any).listTrending || [];
      setResults(trendingData);
    } catch (error) {
      showApiError(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = async (item: MediaItem) => {
    try {
      let data;
      // Kiểm tra mediaStyle: giả sử 1 là Video, 0 là Audio
      if (item.mediaStyle === 1) {
        data = await apiClient.media.getVideo(item.id);
      } else {
        data = await apiClient.media.getById(item.id);
      }
    
      // Đảm bảo data trả về có thêm mediaStyle để PlayerBar biết đường xử lý
      playTrack({ ...data, mediaStyle: item.mediaStyle });
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.featureBar}>
        <button 
          style={{ ...styles.featureBtn, backgroundColor: isTrendingMode ? '#fff' : '#242424', color: isTrendingMode ? '#000' : '#fff' }}
          onClick={handleGetTrending}
        >
          🔥 Bảng xếp hạng Thịnh hành
        </button>
      </div>

      <div style={styles.divider} />

      <h2 style={styles.sectionTitle}>
        {isTrendingMode ? "Bài hát thịnh hành nhất hiện nay" : q ? `Kết quả tìm kiếm cho "${q}"` : "Khám phá"}
      </h2>

      <div>
        {loading && <p style={styles.info}>Đang tải...</p>}
        {!loading && (q || isTrendingMode) && results.length === 0 && <p style={styles.info}>Không tìm thấy dữ liệu.</p>}

        {!loading && results.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Tiêu đề</th>
                <th style={styles.th}>Nghệ sĩ</th>
                <th style={styles.th}>Loại</th>
                <th style={styles.th}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, idx) => (
                <tr key={item.id} style={styles.row} onClick={() => handlePlayTrack(item)}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>
                    <div style={styles.trackName}>
                      {item.urlImage ? <img src={item.urlImage} alt="cover" style={styles.trackCover} /> : <span style={styles.typeIcon}>🎵</span>}
                      {item.title}
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#b3b3b3' }}>{item.artist}</td>
                  <td style={{ ...styles.td, color: '#b3b3b3' }}>{Category[item.category]}</td>
                  {/* Kiểm tra ID trong Set favIds để hiện tim */}
                  <td style={styles.td}>
                    {favIds.has(item.id) ? "❤️" : "🤍"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  featureBar: { display: 'flex', gap: 12, marginBottom: 20 },
  featureBtn: { padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 600, transition: '0.2s' },
  divider: { height: 1, backgroundColor: '#282828', marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  info: { color: '#b3b3b3', marginTop: 16 },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { borderBottom: '1px solid #282828' },
  th: { padding: '12px', textAlign: 'left', color: '#b3b3b3', fontSize: 12, textTransform: 'uppercase' },
  row: { borderBottom: '1px solid #1a1a1a', cursor: 'pointer' },
  td: { padding: '12px', fontSize: 14 },
  trackName: { display: 'flex', alignItems: 'center', gap: 12 },
  typeIcon: { fontSize: 20 },
  trackCover: { width: 40, height: 40, borderRadius: 4, objectFit: 'cover' },
}