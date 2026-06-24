// src/pages/Search.tsx
import { useState } from 'react'
import apiClient, { showApiError } from '../api/apiClient.ts'
import type { MediaDto as MediaItem } from '../types/Media.ts'
import { Category } from '../types/Media.ts'
import { usePlayer } from './PlayerContext.tsx' // Kết nối tới trạm trung tâm (Global State)

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Lấy cái "micro" (hàm playTrack) từ trạm trung tâm để báo cho AudioPlayer biết
  const { playTrack } = usePlayer()

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const data = await apiClient.media.search(query)
      setResults(data.listMedia ?? [])
    } catch (err) {
      // Nếu API lỗi, thông báo cho user và giữ kết quả cũ rỗng.
      showApiError(err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  // Hàm này sẽ chạy khi bạn bấm vào một bài hát trong danh sách
  const handlePlayTrack = async (id: string) => {
    try {
      const response = await apiClient.media.getById(id)
      
      // BÓC VỎ DỮ LIỆU Ở ĐÂY:
      // Kiểm tra xem backend có bọc dữ liệu trong biến 'data' không
      // Ép kiểu (response as any) để lách qua trình kiểm tra của TypeScript
    const realTrackData = (response as any).data ? (response as any).data : response;
    console.log("3. Search.tsx đã lấy được nhạc:", realTrackData);

      // Truyền đúng phần nhân dữ liệu sang cho thanh Player
      playTrack(realTrackData)
      
    } catch (error) {
      showApiError(error)
      alert("Không thể tải bài nhạc này. Vui lòng thử lại.")
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Tìm kiếm</h1>

      {/* Thanh tìm kiếm */}
      <div style={styles.searchBar}>
        <span style={styles.icon}>🔍</span>
        <input
          style={styles.input}
          type="text"
          placeholder="Bài hát, nghệ sĩ, playlist..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.btn} onClick={handleSearch}>Tìm</button>
      </div>

      {/* Kết quả */}
      {loading && <p style={styles.info}>Đang tìm kiếm...</p>}

      {!loading && searched && results.length === 0 && (
        <p style={styles.info}>Không tìm thấy kết quả cho "{query}"</p>
      )}

      {!loading && results.length > 0 && (
        <div>
          <h2 style={styles.sectionTitle}>Kết quả ({results.length})</h2>
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
              {results.map((item, idx) => (
                <tr 
                  key={item.id} 
                  style={styles.row}
                  // Gắn sự kiện onClick vào đây!
                  onClick={() => handlePlayTrack(item.id)}
                >
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>
                    <div style={styles.trackName}>
                      <span style={styles.typeIcon}>🎵</span>
                      {item.title}
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#b3b3b3' }}>{item.artist}</td>
                  <td style={{ ...styles.td, color: '#b3b3b3' }}>{Category[item.category]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 24 },
  searchBar: { display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#242424', borderRadius: 8, padding: '8px 16px', marginBottom: 32, maxWidth: 600 },
  icon: { fontSize: 18 },
  input: { flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 15 },
  btn: { backgroundColor: '#1DB954', color: '#000', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 13 },
  info: { color: '#b3b3b3', marginTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16 },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { borderBottom: '1px solid #282828' },
  th: { padding: '8px 12px', textAlign: 'left', color: '#b3b3b3', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 },
  row: { borderBottom: '1px solid #1a1a1a', cursor: 'pointer' },
  td: { padding: '12px', fontSize: 14 },
  trackName: { display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500 },
  typeIcon: { fontSize: 18 },
}