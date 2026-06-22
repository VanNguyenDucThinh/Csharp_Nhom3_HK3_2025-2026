// src/components/layout/RightPanel.tsx

// Mock: bài đang phát và thông tin nghệ sĩ (dùng để demo giao diện).
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

// Icon đóng panel (dùng chung cho việc thu gọn right panel).
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  )
}

export default function RightPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={styles.container}>
      {/* Header chỉ giữ tab Đang phát và nút đóng, đã bỏ Hàng chờ theo yêu cầu. */}
      <div style={styles.header}>
        <button style={styles.activeTab}>
          Đang phát
        </button>
        <button className="btn-icon" style={styles.closeBtn} onClick={onClose} title="Thu gọn">
          <CloseIcon />
        </button>
      </div>

      <div style={styles.body}>
        <div style={{ ...styles.bigCover, background: `linear-gradient(135deg, ${nowPlaying.coverColor}, #121212)` }}>
          <span style={styles.bigCoverIcon}>🎵</span>
        </div>

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
        <div style={styles.sectionTitle}>Về nghệ sĩ</div>
        <div style={styles.artistBox}>
          <div style={styles.artistAvatar}>🎤</div>
          <div>
            <div style={styles.artistName}>{nowPlaying.artist}</div>
            <div style={styles.artistGenre}>Nhạc thử nghiệm</div>
          </div>
        </div>

        <div style={styles.divider} />
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
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#121212', height: '100%',
    display: 'flex', flexDirection: 'column',
    borderLeft: '1px solid #282828', overflow: 'hidden',
    position: 'relative', zIndex: 1, width: '100%', minWidth: 0,
  },
  header: {
    display: 'flex', alignItems: 'center', gap: 2,
    padding: '14px 12px 10px',
    borderBottom: '1px solid #282828', flexShrink: 0,
  },
  activeTab: {
    backgroundColor: 'transparent', border: 'none',
    color: '#fff', cursor: 'default',
    fontSize: 13, fontWeight: 700,
    padding: '6px 10px', borderRadius: 4,
  },
  closeBtn: {
    marginLeft: 'auto',
    padding: 6,
  },
  body: { overflowY: 'auto', flex: 1, padding: '16px 12px', minHeight: 0 },
  bigCover: {
    width: '100%', aspectRatio: '1', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  bigCoverIcon: { fontSize: 64 },
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
    display: 'flex', padding: 4, flexShrink: 0,
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
