// src/pages/Notifications.tsx
const MOCK_NOTIFS = [
  { id: 1, message: 'Nghệ sĩ Sơn Tùng M-TP vừa tải lên bài hát mới!', time: '10 phút trước' },
  { id: 2, message: 'Đức Thịnh đã chia sẻ playlist "Lofi Chill" cho bạn.', time: '2 giờ trước' },
  { id: 3, message: 'Hệ thống Premium của bạn đã được kích hoạt thành công.', time: '1 ngày trước' }
]

export default function Notifications() {
  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <h1 style={{ marginBottom: 24 }}>Thông báo</h1>
      <div>
        {MOCK_NOTIFS.map(n => (
          <div key={n.id} style={{ padding: 16, backgroundColor: '#121212', borderRadius: 8, marginBottom: 12, borderLeft: '4px solid #1DB954' }}>
            <p style={{ fontSize: 15, fontWeight: '500' }}>{n.message}</p>
            <span style={{ fontSize: 12, color: '#b3b3b3', marginTop: 4, display: 'block' }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}