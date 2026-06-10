// src/pages/Library.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { type Playlist, type MediaItem } from '../api/apiClient'

export default function Library() {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [uploads, setUploads] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [pls, media] = await Promise.all([
          apiClient.playlists.getAll(),
          apiClient.media.getAll(),
        ])
        setPlaylists(pls)
        setUploads(media)
      } catch (err) {
        console.error('Lỗi tải Library:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleCreatePlaylist = async () => {
    if (!newName.trim()) return
    try {
      const pl = await apiClient.playlists.create({ name: newName, isPublic: false })
      setPlaylists(prev => [pl, ...prev])
      setNewName('')
      setShowCreate(false)
    } catch (err) {
      console.error('Lỗi tạo playlist:', err)
    }
  }

  if (loading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Thư viện</h1>
        <button style={styles.addBtn} onClick={() => setShowCreate(!showCreate)}>+ Tạo playlist</button>
      </div>

      {/* Form tạo playlist */}
      {showCreate && (
        <div style={styles.createForm}>
          <input
            style={styles.input}
            placeholder="Tên playlist..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreatePlaylist()}
          />
          <button style={styles.confirmBtn} onClick={handleCreatePlaylist}>Tạo</button>
          <button style={styles.cancelBtn} onClick={() => setShowCreate(false)}>Hủy</button>
        </div>
      )}

      {/* Playlist của tôi */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Playlist của tôi ({playlists.length})</h2>
        {playlists.length === 0
          ? <p style={styles.empty}>Chưa có playlist nào.</p>
          : (
            <div style={styles.list}>
              {playlists.map(pl => (
                <div key={pl.id} style={styles.item} onClick={() => navigate(`/playlist/${pl.id}`)}>
                  <div style={styles.itemIcon}>🎵</div>
                  <div>
                    <div style={styles.itemName}>{pl.name}</div>
                    <div style={styles.itemSub}>{pl.tracks?.length ?? 0} bài · {pl.isPublic ? 'Công khai' : 'Riêng tư'}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      {/* Bài hát đã tải lên */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Bài tôi đã tải lên ({uploads.length})</h2>
        {uploads.length === 0
          ? <p style={styles.empty}>Chưa có file nào được tải lên.</p>
          : (
            <div style={styles.list}>
              {uploads.map(item => (
                <div key={item.id} style={styles.item}>
                  <div style={styles.itemIcon}>{item.type === 'video' ? '🎬' : '🎵'}</div>
                  <div>
                    <div style={styles.itemName}>{item.title}</div>
                    <div style={styles.itemSub}>{item.artist} · {item.type === 'video' ? 'Video' : 'Audio'}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700 },
  addBtn: { backgroundColor: '#1DB954', color: '#000', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 700, cursor: 'pointer' },
  createForm: { display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center' },
  input: { backgroundColor: '#242424', border: '1px solid #383838', borderRadius: 6, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none', width: 280 },
  confirmBtn: { backgroundColor: '#1DB954', color: '#000', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 700, cursor: 'pointer' },
  cancelBtn: { backgroundColor: 'transparent', color: '#b3b3b3', border: '1px solid #383838', borderRadius: 6, padding: '10px 18px', cursor: 'pointer' },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  item: { display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 6, cursor: 'pointer', backgroundColor: 'transparent' },
  itemIcon: { fontSize: 22, width: 44, height: 44, backgroundColor: '#282828', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: 600 },
  itemSub: { fontSize: 12, color: '#b3b3b3', marginTop: 2 },
  empty: { color: '#b3b3b3', fontSize: 14 },
}