// src/pages/PlaylistDetail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient, { type Playlist } from '../api/apiClient'

export default function PlaylistDetail() {
  const { id } = useParams()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    apiClient.playlists.getById(Number(id))
      .then(setPlaylist)
      .catch(err => console.error('Lỗi tải playlist:', err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>
  if (!playlist) return <div style={{ padding: 40, color: '#b3b3b3' }}>Không tìm thấy playlist.</div>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.coverBox}>🎵</div>
        <div>
          <p style={styles.label}>Playlist</p>
          <h1 style={styles.name}>{playlist.name}</h1>
          <p style={styles.meta}>{playlist.tracks?.length ?? 0} bài hát · {playlist.isPublic ? 'Công khai' : 'Riêng tư'}</p>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thead}>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Tiêu đề</th>
            <th style={styles.th}>Nghệ sĩ</th>
            <th style={styles.th}>Loại</th>
          </tr>
        </thead>
        <tbody>
          {(playlist.tracks ?? []).map((track, idx) => (
            <tr key={track.id} style={styles.row}>
              <td style={styles.td}>{idx + 1}</td>
              <td style={{ ...styles.td, fontWeight: 600 }}>{track.title}</td>
              <td style={{ ...styles.td, color: '#b3b3b3' }}>{track.artist}</td>
              <td style={{ ...styles.td, color: '#b3b3b3' }}>{track.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  header: { display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 32, padding: '24px', background: 'linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), #3d3d3d', borderRadius: 8 },
  coverBox: { width: 160, height: 160, backgroundColor: '#282828', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, flexShrink: 0 },
  label: { color: '#b3b3b3', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  name: { fontSize: 36, fontWeight: 700, marginBottom: 8 },
  meta: { color: '#b3b3b3', fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { borderBottom: '1px solid #282828' },
  th: { padding: '8px 12px', textAlign: 'left', color: '#b3b3b3', fontSize: 12, fontWeight: 500 },
  row: { borderBottom: '1px solid #1a1a1a', cursor: 'pointer' },
  td: { padding: '12px', fontSize: 14 },
}