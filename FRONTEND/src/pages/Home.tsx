// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { showApiError, type MediaItem, type Playlist } from '../api/apiClient'
import HScrollSection from '../components/layout/HScrollSection'

const USE_MOCK = true

const mockPlaylists: Playlist[] = [
  { id: 1, name: 'Nhạc yêu thích', isPublic: true,  ownerId: '1', tracks: [], createdAt: '' },
  { id: 2, name: 'Chill Vibes'   , isPublic: true,  ownerId: '1', tracks: [], createdAt: '' },
  { id: 3, name: 'Workout Mix'   , isPublic: false, ownerId: '1', tracks: [], createdAt: '' },
  { id: 4, name: 'V-Pop Hot'     , isPublic: true,  ownerId: '1', tracks: [], createdAt: '' },
  { id: 5, name: 'Study Lofi'    , isPublic: true,  ownerId: '1', tracks: [], createdAt: '' },
  { id: 6, name: 'Top Hits 2025' , isPublic: true,  ownerId: '1', tracks: [], createdAt: '' },
  { id: 7, name: 'Lo-fi Beats'   , isPublic: true,  ownerId: '1', tracks: [], createdAt: '' },
  { id: 8, name: 'Indie Vibes'   , isPublic: true,  ownerId: '1', tracks: [], createdAt: '' },
]

const mockTracks: MediaItem[] = [
  { id: 1, title: 'Bài Hát Mẫu 1', artist: 'Nghệ Sĩ A', type: 'audio', fileUrl: '', duration: 210, ownerId: '1', createdAt: '' },
  { id: 2, title: 'Video Clip 1' , artist: 'Nghệ Sĩ B', type: 'video', fileUrl: '', duration: 300, ownerId: '1', createdAt: '' },
  { id: 3, title: 'Bài Hát Mẫu 2', artist: 'Nghệ Sĩ C', type: 'audio', fileUrl: '', duration: 185, ownerId: '1', createdAt: '' },
  { id: 4, title: 'Acoustic Mix' , artist: 'Nghệ Sĩ D', type: 'audio', fileUrl: '', duration: 240, ownerId: '1', createdAt: '' },
  { id: 5, title: 'Jazz Night'   , artist: 'Nghệ Sĩ E', type: 'audio', fileUrl: '', duration: 195, ownerId: '1', createdAt: '' },
  { id: 6, title: 'Ballad VN'    , artist: 'Nghệ Sĩ F', type: 'audio', fileUrl: '', duration: 220, ownerId: '1', createdAt: '' },
]

const cardColors = ['#1e3264', '#7358ff', '#e8115b', '#148a08', '#e91429', '#8400e7', '#1e6432', '#e87c13']

// Card nhạc/playlist dạng dọc giống Spotify — width cố định để scroll ngang đẹp
function MediaCard({ item }: { item: MediaItem }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ ...cardStyles.card, backgroundColor: hovered ? '#282828' : '#181818' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={cardStyles.cover}>
        {item.thumbnailUrl
          ? <img src={item.thumbnailUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 40 }}>{item.type === 'video' ? '🎬' : '🎵'}</span>
        }
        <div style={{ ...cardStyles.playOverlay, opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(4px)' }}>
          <div style={cardStyles.playCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
        </div>
      </div>
      <div style={cardStyles.title}>{item.title}</div>
      <div style={cardStyles.sub}>{item.artist}</div>
    </div>
  )
}

function PlaylistCard({ pl, index, onClick }: { pl: Playlist; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      style={{ ...cardStyles.card, backgroundColor: hovered ? '#282828' : '#181818' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ ...cardStyles.cover, background: `linear-gradient(135deg, ${cardColors[index % cardColors.length]}, #121212)` }}>
        <span style={{ fontSize: 36 }}>🎵</span>
        <div style={{ ...cardStyles.playOverlay, opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(4px)' }}>
          <div style={cardStyles.playCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="black"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
        </div>
      </div>
      <div style={cardStyles.title}>{pl.name}</div>
      <div style={cardStyles.sub}>Playlist · {pl.isPublic ? 'Công khai' : 'Riêng tư'}</div>
    </div>
  )
}

// Hàm tính greeting dựa trên giờ trong ngày (dùng useState với hàm khởi tạo).
const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Chào buổi sáng'
  else if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

export default function Home() {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [recentTracks, setRecentTracks] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  // Sử dụng hàm khởi tạo để tính greeting một lần khi component tạo, tránh setState trong effect.
  const [greeting] = useState(() => getGreeting())

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
        showApiError('Không tải được dữ liệu trang chủ.', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>

  return (
    <div style={styles.page}>
      {/* Greeting - được tính khi component khởi tạo để tránh cảnh báo lint */}
      <h1 style={styles.greeting}>{greeting}!</h1>

      {/* Quick grid — 2 hàng 3 cột, giống Spotify khi mới mở */}
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

      {/* Nghe gần đây — cuộn ngang */}
      <HScrollSection title="Nghe gần đây" onSeeAll={() => navigate('/library')}>
        {recentTracks.map(track => (
          <MediaCard key={track.id} item={track} />
        ))}
      </HScrollSection>

      {/* Playlist của bạn — cuộn ngang */}
      <HScrollSection title="Playlist của bạn" onSeeAll={() => navigate('/library')}>
        {playlists.map((pl, i) => (
          <PlaylistCard
            key={pl.id}
            pl={pl}
            index={i}
            onClick={() => navigate(`/playlist/${pl.id}`)}
          />
        ))}
      </HScrollSection>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 24px 40px', color: '#fff' },
  greeting: { fontSize: 28, fontWeight: 800, marginBottom: 20 },
  quickGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8, marginBottom: 40,
  },
  quickCard: {
    display: 'flex', alignItems: 'center', gap: 12,
    borderRadius: 6, overflow: 'hidden',
    cursor: 'pointer', height: 56, paddingRight: 16,
    transition: 'opacity 0.2s',
  },
  quickIcon: {
    width: 56, height: 56, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, backgroundColor: 'rgba(0,0,0,0.3)',
  },
  quickName: { fontWeight: 700, fontSize: 13 },
}

// Card styles — width cố định 160px để scroll ngang đẹp
const cardStyles: Record<string, React.CSSProperties> = {
  card: {
    borderRadius: 8, padding: 16, cursor: 'pointer',
    width: 160, flexShrink: 0,          // <-- cố định width
    transition: 'background-color 0.2s',
    position: 'relative',
  },
  cover: {
    width: '100%', aspectRatio: '1',
    backgroundColor: '#282828', borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, overflow: 'hidden', position: 'relative',
  },
  playOverlay: {
    position: 'absolute', bottom: 8, right: 8,
    transition: 'opacity 0.2s, transform 0.2s',
  },
  playCircle: {
    width: 40, height: 40, borderRadius: '50%',
    backgroundColor: '#1DB954',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  title: { fontSize: 14, fontWeight: 700, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sub: { fontSize: 12, color: '#b3b3b3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
}