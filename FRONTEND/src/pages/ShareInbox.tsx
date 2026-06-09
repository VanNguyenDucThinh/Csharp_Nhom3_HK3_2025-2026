// src/pages/ShareInbox.tsx
const MOCK_INBOX = [
  { id: 1, sender: 'Nguyễn Văn A', mediaName: 'Chạy Ngay Đi', type: 'Bài hát' },
  { id: 2, sender: 'Trần Thị B', mediaName: 'Coding Beats Vol 2', type: 'Playlist' }
]

export default function ShareInbox() {
  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <h1 style={{ marginBottom: 24 }}>Hộp thư chia sẻ</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MOCK_INBOX.map(item => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#181818', borderRadius: 8 }}>
            <div>
              <span style={{ fontWeight: 'bold', color: '#1DB954' }}>{item.sender}</span>
              <span> đã gửi cho bạn một {item.type.toLowerCase()}: </span>
              <span style={{ fontStyle: 'italic', fontWeight: '500' }}>"{item.mediaName}"</span>
            </div>
            <button style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 16, fontWeight: 'bold', cursor: 'pointer' }}>
              Nghe ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}