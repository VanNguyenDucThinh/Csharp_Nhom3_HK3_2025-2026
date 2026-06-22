// src/components/layout/FriendActivity.tsx
// Nội dung RightPanel hiển thị khi bấm icon Friends trên header

const mockFriends = [
  { id: 1, name: 'Đang offline', online: false },
  { id: 2, name: 'Đang offline', online: false },
  { id: 3, name: 'Đang offline', online: false },
]

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
function PersonPlaceholder() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </svg>
  )
}

export default function FriendActivity({ onClose }: { onClose: () => void }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Hoạt động bạn bè</span>
        <button className="btn-icon" style={styles.closeBtn} onClick={onClose} title="Thu gọn">
          <CloseIcon />
        </button>
      </div>

      <div style={styles.body}>
        <p style={styles.desc}>
          Cho phép bạn bè và người theo dõi trên TuneVault xem bạn đang nghe gì.
        </p>

        <div style={styles.list}>
          {mockFriends.map(f => (
            <div key={f.id} style={styles.friendRow}>
              <div style={styles.avatarWrap}>
                <div style={styles.avatar}><PersonPlaceholder /></div>
                {f.online && <span style={styles.onlineDot} />}
              </div>
              <div style={styles.skeletonLines}>
                <div style={styles.skeletonLine} />
                <div style={{ ...styles.skeletonLine, width: '60%' }} />
              </div>
            </div>
          ))}
        </div>

        <p style={styles.hint}>
          Vào Cài đặt &gt; Xã hội và bật "Chia sẻ hoạt động nghe nhạc". Bạn có thể tắt bất cứ lúc nào.
        </p>

        <button className="btn-secondary" style={{ width: '100%' }}>
          Cài đặt
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 16px 12px', borderBottom: '1px solid #282828', flexShrink: 0,
  },
  title: { fontSize: 14, fontWeight: 700, color: '#fff' },
  closeBtn: { padding: 6 },
  body: { padding: '20px 16px', overflowY: 'auto', flex: 1 },
  desc: { fontSize: 13, color: '#fff', marginBottom: 24, lineHeight: 1.5 },
  list: { display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 },
  friendRow: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 40, height: 40, borderRadius: '50%',
    backgroundColor: '#3a3a3a', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 10, height: 10, borderRadius: '50%',
    backgroundColor: '#1DB954', border: '2px solid #121212',
  },
  skeletonLines: { flex: 1, display: 'flex', flexDirection: 'column', gap: 6 },
  skeletonLine: { height: 8, backgroundColor: '#3a3a3a', borderRadius: 4, width: '85%' },
  hint: { fontSize: 12, color: '#b3b3b3', lineHeight: 1.6, marginBottom: 20 },
}
