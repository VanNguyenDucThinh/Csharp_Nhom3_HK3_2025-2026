// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { type MediaItem, type Playlist } from '../api/apiClient'

const USE_MOCK = true

// Mock data giống Spotify
const mockPlaylists: Playlist[] = [
  { id: 1, name: 'Nhạc yêu thích', isPublic: true, ownerId: '1', tracks: [], createdAt: '' },
  { id: 2, name: 'Chill Vibes', isPublic: true, ownerId: '1', tracks: [], createdAt: '' },
  { id: 3, name: 'Workout Mix', isPublic: false, ownerId: '1', tracks: [], createdAt: '' },
  { id: 4, name: 'V-Pop Hot', isPublic: true, ownerId: '1', tracks: [], createdAt: '' },
  { id: 5, name: 'Study Lofi', isPublic: true, ownerId: '1', tracks: [], createdAt: '' },
  { id: 6, name: 'Top Hits 2025', isPublic: true, ownerId: '1', tracks: [], createdAt: '' },
]

const mockTracks: MediaItem[] = [
  { id: 1, title: 'Bài Hát Mẫu 1', artist: 'Nghệ Sĩ A', type: 'audio', fileUrl: '', duration: 210, ownerId: '1', createdAt: '' },
  { id: 2, title: 'Video Clip 1', artist: 'Nghệ Sĩ B', type: 'video', fileUrl: '', duration: 300, ownerId: '1', createdAt: '' },
  { id: 3, title: 'Bài Hát Mẫu 2', artist: 'Nghệ Sĩ C', type: 'audio', fileUrl: '', duration: 185, ownerId: '1', createdAt: '' },
  { id: 4, title: 'Acoustic Mix', artist: 'Nghệ Sĩ D', type: 'audio', fileUrl: '', duration: 240, ownerId: '1', createdAt: '' },
]

// Màu gradient cho card playlist (giống Spotify)
const cardColors = ['#1e3264', '#7358ff', '#e8115b', '#148a08', '#e91429', '#8400e7']

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

export default function Home() {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [recentTracks, setRecentTracks] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (USE_MOCK) {
        setPlaylists(mockPlaylists)
        setRecentTracks(mockTracks)
        setLoading(false)
        return
      }
      try {
        const [pls, tracks] = await Promise.all([
          apiClient.playlists.getAll(),
          apiClient.history.getRecent(),
        ])
        setPlaylists(pls)
        setRecentTracks(tracks)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>

  return (
    <div style={styles.page}>
      {/* Greeting */}
      <h1 style={styles.greeting}>{getGreeting()}!</h1>

      {/* Quick access grid - 2 hàng 3 cột */}
      <div style={styles.quickGrid}>
        {playlists.slice(0, 6).map((pl, i) => (
          <div
            key={pl.id}
            style={{ ...styles.quickCard, backgroundColor: cardColors[i % cardColors.length] }}
            onClick={() => navigate(`/playlist/${pl.id}`)}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <div style={styles.quickIcon}>🎵</div>
            <span style={styles.quickName}>{pl.name}</span>
          </div>
        ))}
      </div>

      {/* Section: Nghe gần đây */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Nghe gần đây</h2>
          <span style={styles.seeAll} onClick={() => navigate('/library')}>Hiện tất cả</span>
        </div>
        <div style={styles.cardGrid}>
          {recentTracks.map(track => (
            <MediaCard key={track.id} item={track} />
          ))}
        </div>
      </section>

      {/* Section: Playlist của bạn */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Playlist của bạn</h2>
          <span style={styles.seeAll} onClick={() => navigate('/library')}>Hiện tất cả</span>
        </div>
        <div style={styles.cardGrid}>
          {playlists.map((pl, i) => (
            <div
              key={pl.id}
              style={styles.mediaCard}
              onClick={() => navigate(`/playlist/${pl.id}`)}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#282828')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#181818')}
            >
              <div style={{ ...styles.mediaCover, background: `linear-gradient(135deg, ${cardColors[i % cardColors.length]}, #121212)` }}>
                <span style={{ fontSize: 36 }}>🎵</span>
              </div>
              <div style={styles.mediaTitle}>{pl.name}</div>
              <div style={styles.mediaSub}>Playlist · {pl.isPublic ? 'Công khai' : 'Riêng tư'}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div
      style={styles.mediaCard}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#282828')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#181818')}
    >
      <div style={styles.mediaCover}>
        {item.thumbnailUrl
          ? <img src={item.thumbnailUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 40 }}>{item.type === 'video' ? '🎬' : '🎵'}</span>
        }
        {/* Nút play hiện khi hover */}
        <div style={styles.playOverlay}>
          <div style={styles.playCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      </div>
      <div style={styles.mediaTitle}>{item.title}</div>
      <div style={styles.mediaSub}>{item.artist}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 24px 40px', color: '#fff', overflowY: 'auto' },
  greeting: { fontSize: 28, fontWeight: 800, marginBottom: 20 },

  // Quick grid
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    marginBottom: 32,
  },
  quickCard: {
    display: 'flex', alignItems: 'center', gap: 12,
    borderRadius: 6, overflow: 'hidden',
    cursor: 'pointer', height: 56,
    paddingRight: 16,
    transition: 'opacity 0.2s',
  },
  quickIcon: {
    width: 56, height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, backgroundColor: 'rgba(0,0,0,0.3)',
    flexShrink: 0,
  },
  quickName: { fontWeight: 700, fontSize: 13, lineHeight: 1.3 },

  // Sections
  section: { marginBottom: 40 },
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: 800 },
  seeAll: { fontSize: 12, color: '#b3b3b3', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 },

  // Card grid
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: 16,
  },
  mediaCard: {
    backgroundColor: '#181818',
    borderRadius: 8, padding: 16,
    cursor: 'pointer', position: 'relative',
  },
  mediaCover: {
    width: '100%', aspectRatio: '1',
    backgroundColor: '#282828', borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, overflow: 'hidden', position: 'relative',
  },
  playOverlay: {
    position: 'absolute', bottom: 8, right: 8,
    opacity: 0, transition: 'opacity 0.2s',
  },
  playCircle: {
    width: 40, height: 40, borderRadius: '50%',
    backgroundColor: '#1DB954',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  mediaTitle: { fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  mediaSub: { fontSize: 12, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
}