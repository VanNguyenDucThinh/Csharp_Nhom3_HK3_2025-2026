// src/components/layout/RightPanel.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock: bài đang phát và thông tin nghệ sĩ
const nowPlaying = {
  title: 'SoundHelix Song 1',
  artist: 'Bản Nhạc Thử Nghiệm',
  album: 'Demo Album',
  coverColor: '#1e3264',
}

const relatedArtists = [
  { name: 'Sơn Tùng M-TP', genre: 'V-Pop' },
  { name: 'Hà Anh Tuấn', genre: 'Ballad' },
  { name: 'Đen Vâu', genre: 'Rap' },
]

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
  )
}

export default function RightPanel() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'nowplaying' | 'queue'>('nowplaying')

  return (
    <div style={styles.container}>
      {/* Header tabs */}
      <div style={styles.header}>
        <button
          style={{ ...styles.tab, ...(tab === 'nowplaying' ? styles.tabActive : {}) }}
          onClick={() => setTab('nowplaying')}
        >
          Đang phát
        </button>
        <button
          style={{ ...styles.tab, ...(tab === 'queue' ? styles.tabActive : {}) }}
          onClick={() => setTab('queue')}
        >
          Hàng chờ
        </button>
        <button style={styles.expandBtn} title="Mở rộng" onClick={() => navigate('/profile')}>
          <ExpandIcon />
        </button>
      </div>

      {tab === 'nowplaying' && (
        <div style={styles.body}>
          {/* Cover lớn */}
          <div style={{ ...styles.bigCover, background: `linear-gradient(135deg, ${nowPlaying.coverColor}, #121212)` }}>
            <span style={{ fontSize: 64 }}>🎵</span>
          </div>

          {/* Info + like */}
          <div style={styles.trackInfo}>
            <div>
              <div style={styles.trackTitle}>{nowPlaying.title}</div>
              <div style={styles.trackArtist}>{nowPlaying.artist}</div>
              <div style={styles.trackAlbum}>{nowPlaying.album}</div>
            </div>
            <button style={styles.likeBtn} title="Yêu thích">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <div style={styles.divider} />

          {/* Nghệ sĩ liên quan */}
          <div style={styles.sectionTitle}>Về nghệ sĩ</div>
          <div style={styles.artistBox}>
            <div style={styles.artistAvatar}>🎤</div>
            <div>
              <div style={styles.artistName}>{nowPlaying.artist}</div>
              <div style={styles.artistGenre}>Nhạc thử nghiệm</div>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Gợi ý nghệ sĩ */}
          <div style={styles.sectionTitle}>Nghệ sĩ tương tự</div>
          {relatedArtists.map(a => (
            <div key={a.name} style={styles.relatedItem}>
              <div style={styles.relatedAvatar}>🎵</div>
              <div>
                <div style={styles.relatedName}>{a.name}</div>
                <div style={styles.relatedGenre}>{a.genre}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'queue' && (
        <div style={styles.body}>
          <div style={styles.sectionTitle}>Tiếp theo</div>
          <p style={{ color: '#b3b3b3', fontSize: 13, marginTop: 8 }}>
            Hàng chờ trống. Thêm bài hát để phát tiếp theo.
          </p>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#121212',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #282828',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '16px 12px 8px',
    borderBottom: '1px solid #282828',
    flexShrink: 0,
  },
  tab: {
    backgroundColor: 'transparent', border: 'none',
    color: '#b3b3b3', cursor: 'pointer',
    fontSize: 13, fontWeight: 700,
    padding: '6px 10px', borderRadius: 4,
    flex: 1,
  },
  tabActive: { color: '#fff', borderBottom: '2px solid #1DB954' },
  expandBtn: {
    backgroundColor: 'transparent', border: 'none',
    color: '#b3b3b3', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    padding: 6, borderRadius: 4, marginLeft: 'auto',
  },
  body: { overflowY: 'auto', flex: 1, padding: '16px 12px' },
  bigCover: {
    width: '100%', aspectRatio: '1',
    borderRadius: 8, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  trackInfo: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  trackTitle: { fontSize: 15, fontWeight: 700, marginBottom: 4, color: '#fff' },
  trackArtist: { fontSize: 13, color: '#b3b3b3', marginBottom: 2 },
  trackAlbum: { fontSize: 12, color: '#535353' },
  likeBtn: {
    backgroundColor: 'transparent', border: 'none',
    color: '#b3b3b3', cursor: 'pointer',
    display: 'flex', alignItems: 'center',
    padding: 4, flexShrink: 0,
  },
  divider: { height: 1, backgroundColor: '#282828', margin: '16px 0' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 },
  artistBox: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  artistAvatar: {
    width: 44, height: 44, borderRadius: '50%',
    backgroundColor: '#282828', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0,
  },
  artistName: { fontSize: 13, fontWeight: 700, color: '#fff' },
  artistGenre: { fontSize: 12, color: '#b3b3b3', marginTop: 2 },
  relatedItem: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' },
  relatedAvatar: {
    width: 36, height: 36, borderRadius: 4,
    backgroundColor: '#282828', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
  },
  relatedName: { fontSize: 13, fontWeight: 600, color: '#b3b3b3' },
  relatedGenre: { fontSize: 11, color: '#535353', marginTop: 2 },
}