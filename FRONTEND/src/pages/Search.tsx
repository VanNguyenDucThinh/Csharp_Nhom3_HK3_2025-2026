// src/pages/Search.tsx
import { useState } from 'react'
import apiClient from '../api/apiClient'
import type { MediaItem } from '../types/tuneVault'
import { useMessageBox } from '../hooks/useMessageBox'
import MessageBox from '../components/common/MessageBox'
import { safeApiCall } from '../utils/safeApiCall'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const { messageBox, showMessage, hideMessage } = useMessageBox()

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)
    setResults([])

    const data = await safeApiCall(
      () => apiClient.media.search(query),
      'Không tìm kiếm được dữ liệu. Vui lòng thử lại sau.',
      showMessage,
    )

    if (data) {
      setResults(data)
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Tìm kiếm</h1>

      {messageBox && (
        <MessageBox
          type={messageBox.type}
          message={messageBox.message}
          onClose={hideMessage}
        />
      )}

      {/* Thanh tìm kiếm */}
      <div style={styles.searchBar}>
        <span style={styles.icon}>🔍</span>
        <input
          data-shortcut="search-input"
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
                <tr key={item.id} style={styles.row}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>
                    <div style={styles.trackName}>
                      <span style={styles.typeIcon}>{item.type === 'video' ? '🎬' : '🎵'}</span>
                      {item.title}
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#b3b3b3' }}>{item.artist}</td>
                  <td style={{ ...styles.td, color: '#b3b3b3', textTransform: 'capitalize' }}>{item.type}</td>
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