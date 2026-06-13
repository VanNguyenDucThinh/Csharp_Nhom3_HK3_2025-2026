// src/pages/Library.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import type { MediaItem, Playlist } from '../types/tuneVault'
import { useMessageBoxStore } from '../stores/messageBoxStore'
import { useRealtimeStore } from '../stores/realtimeStore'
import { safeApiCall } from '../utils/safeApiCall'

// Mock data để test khi chưa có backend
const USE_MOCK = true

export default function Library() {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [uploads, setUploads] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  // Lấy playlist realtime từ store để Library cập nhật khi backend gửi PlaylistUpdated.
  const realtimePlaylists = useRealtimeStore(state => state.playlists)

  // Lấy media realtime từ store để Library cập nhật khi backend gửi TrackAdded.
  const realtimeUploads = useRealtimeStore(state => state.recentMediaItems)

  // Lấy hàm hiển thị MessageBox toàn cục khi gọi API lỗi.
  const showMessage = useMessageBoxStore(state => state.showMessage)

  // Chọn dữ liệu realtime nếu đã có, nếu chưa có thì dùng dữ liệu API hoặc mock.
  const playlistsToShow = realtimePlaylists.length > 0 ? realtimePlaylists : playlists

  // Chọn media realtime nếu đã có, nếu chưa có thì dùng dữ liệu API hoặc mock.
  const uploadsToShow = realtimeUploads.length > 0 ? realtimeUploads : uploads

  useEffect(() => {
    const load = async () => {
      if (USE_MOCK) {
        // Dữ liệu mẫu để test giao diện
        setPlaylists([])
        setUploads([])
        setLoading(false)
        return
      }
      try {
        const [playlistData, mediaData] = await Promise.all([
          safeApiCall(
            () => apiClient.playlists.getAll(),
            'Không thể tải danh sách playlist.',
            showMessage,
          ),
          safeApiCall(
            () => apiClient.media.getAll(),
            'Không thể tải danh sách media.',
            showMessage,
          ),
        ])

        const pls = playlistData ?? []
        const media = mediaData ?? []
        setPlaylists(pls)
        setUploads(media)
        useRealtimeStore.getState().setPlaylists(pls)
      } catch (err) {
        console.error('Lỗi tải Library:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [showMessage])

  const handleCreatePlaylist = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      if (USE_MOCK) {
        // Tạo playlist giả để test
        const mockPlaylist: Playlist = {
          id: Date.now(),
          name: newName.trim(),
          isPublic: false,
          ownerId: '1',
          tracks: [],
          createdAt: new Date().toISOString(),
        }
        setPlaylists(prev => [mockPlaylist, ...prev])
        useRealtimeStore.getState().upsertPlaylist(mockPlaylist)
      } else {
        const pl = await safeApiCall(
          () => apiClient.playlists.create({ name: newName.trim(), isPublic: false }),
          'Không thể tạo playlist.',
          showMessage,
        )
        if (pl) {
          setPlaylists(prev => [pl, ...prev])
          useRealtimeStore.getState().upsertPlaylist(pl)
        }
      }
      setNewName('')
      setShowCreate(false)
    } catch (err) {
      console.error('Lỗi tạo playlist:', err)
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Thư viện</h1>
        <button style={styles.addBtn} onClick={() => setShowCreate(!showCreate)}>
          + Tạo playlist
        </button>
      </div>

      {/* Form tạo playlist */}
      {showCreate && (
        <div style={styles.createForm}>
          <input
            style={styles.input}
            placeholder="Nhập tên playlist..."
            value={newName}
            autoFocus
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCreatePlaylist()
              if (e.key === 'Escape') setShowCreate(false)
            }}
          />
          <button
            style={{ ...styles.confirmBtn, ...(creating ? { opacity: 0.6 } : {}) }}
            onClick={handleCreatePlaylist}
            disabled={creating}
          >
            {creating ? 'Đang tạo...' : 'Tạo'}
          </button>
          <button style={styles.cancelBtn} onClick={() => { setShowCreate(false); setNewName('') }}>
            Hủy
          </button>
        </div>
      )}

      {/* Playlist của tôi */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Playlist của tôi ({playlistsToShow.length})</h2>
        {playlistsToShow.length === 0
          ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyText}>Chưa có playlist nào.</p>
              <button style={styles.emptyBtn} onClick={() => setShowCreate(true)}>
                Tạo playlist đầu tiên
              </button>
            </div>
          )
          : (
            <div style={styles.list}>
              {playlistsToShow.map(pl => (
                <div
                  key={pl.id}
                  style={styles.item}
                  onClick={() => navigate(`/playlist/${pl.id}`)}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1a1a1a')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={styles.itemIcon}>🎵</div>
                  <div>
                    <div style={styles.itemName}>{pl.name}</div>
                    <div style={styles.itemSub}>
                      {pl.tracks?.length ?? 0} bài · {pl.isPublic ? 'Công khai' : 'Riêng tư'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>

      {/* Bài hát đã tải lên */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Bài tôi đã tải lên ({uploadsToShow.length})</h2>
        {uploadsToShow.length === 0
          ? <p style={styles.emptyText}>Chưa có file nào được tải lên.</p>
          : (
            <div style={styles.list}>
              {uploadsToShow.map(item => (
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
  addBtn: { backgroundColor: '#1DB954', color: '#000', border: 'none', borderRadius: 20, padding: '8px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
  createForm: { display: 'flex', gap: 10, marginBottom: 24, alignItems: 'center', backgroundColor: '#1a1a1a', padding: '16px', borderRadius: 8 },
  input: { backgroundColor: '#2a2a2a', border: '1px solid #535353', borderRadius: 6, padding: '10px 16px', color: '#fff', fontSize: 14, outline: 'none', width: 300 },
  confirmBtn: { backgroundColor: '#1DB954', color: '#000', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: 14 },
  cancelBtn: { backgroundColor: 'transparent', color: '#b3b3b3', border: '1px solid #535353', borderRadius: 6, padding: '10px 18px', cursor: 'pointer', fontSize: 14 },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  item: { display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', borderRadius: 6, cursor: 'pointer', backgroundColor: 'transparent' },
  itemIcon: { fontSize: 22, width: 44, height: 44, backgroundColor: '#282828', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  itemName: { fontSize: 14, fontWeight: 600 },
  itemSub: { fontSize: 12, color: '#b3b3b3', marginTop: 2 },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 },
  emptyText: { color: '#b3b3b3', fontSize: 14 },
  emptyBtn: { backgroundColor: 'transparent', color: '#fff', border: '1px solid #535353', borderRadius: 20, padding: '8px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
}