// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import apiClient, { type MediaItem, type Playlist } from '../api/apiClient'

export default function Home() {
  const [recentTracks, setRecentTracks] = useState<MediaItem[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tracks, lists] = await Promise.all([
          apiClient.history.getRecent(),
          apiClient.playlists.getAll(),
        ])
        setRecentTracks(tracks)
        setPlaylists(lists)
      } catch (err) {
        console.error('Lỗi tải Home:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div style={styles.loading}>Đang tải...</div>

  return (
    <div style={styles.page}>
      {/* Chào buổi tối */}
      <h1 style={styles.greeting}>Chào buổi tối!</h1>

      {/* Playlist nhanh */}
      {playlists.length > 0 && (
        <section style={styles.section}>
          <div style={styles.grid}>
            {playlists.slice(0, 6).map(pl => (
              <div key={pl.id} style={styles.quickCard}>
                <span style={styles.quickIcon}>🎵</span>
                <span style={styles.quickName}>{pl.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nghe gần đây */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Nghe gần đây</h2>
        {recentTracks.length === 0
          ? <p style={styles.empty}>Chưa có bài hát nào. Hãy khám phá thư viện!</p>
          : (
            <div style={styles.trackGrid}>
              {recentTracks.map(track => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )
        }
      </section>
    </div>
  )
}

function TrackCard({ track }: { track: MediaItem }) {
  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.cover}>
        {track.thumbnailUrl
          ? <img src={track.thumbnailUrl} alt={track.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 32 }}>{track.type === 'video' ? '🎬' : '🎵'}</span>
        }
      </div>
      <div style={cardStyles.title}>{track.title}</div>
      <div style={cardStyles.artist}>{track.artist}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  loading: { padding: 40, color: '#b3b3b3', textAlign: 'center' },
  greeting: { fontSize: 28, fontWeight: 700, marginBottom: 24 },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: 700, marginBottom: 16 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 },
  quickCard: { backgroundColor: '#282828', borderRadius: 6, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  quickIcon: { fontSize: 20 },
  quickName: { fontWeight: 600, fontSize: 14 },
  trackGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 },
  empty: { color: '#b3b3b3', fontSize: 14 },
}

const cardStyles: Record<string, React.CSSProperties> = {
  card: { backgroundColor: '#181818', borderRadius: 8, padding: 16, cursor: 'pointer' },
  cover: { width: '100%', aspectRatio: '1', backgroundColor: '#282828', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' },
  title: { fontWeight: 600, fontSize: 14, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  artist: { fontSize: 12, color: '#b3b3b3' },
}