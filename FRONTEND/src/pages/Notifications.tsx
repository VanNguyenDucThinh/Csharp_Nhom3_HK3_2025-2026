// src/pages/Notifications.tsx
import { useEffect, useState } from 'react'
import apiClient from '../api/apiClient'
import { useMessageBoxStore } from '../stores/messageBoxStore'
import { useRealtimeStore } from '../stores/realtimeStore'
import { safeApiCall } from '../utils/safeApiCall'

export default function Notifications() {
  // Lấy thông báo realtime từ Zustand store thay vì chỉ dùng local state.
  const notifications = useRealtimeStore(state => state.notifications)

  // Lấy số thông báo chưa đọc từ store realtime.
  const unreadCount = useRealtimeStore(state => state.unreadCount)

  // Lấy hàm cập nhật toàn bộ danh sách thông báo từ API.
  const setNotifications = useRealtimeStore(state => state.setNotifications)

  // Lấy hàm đánh dấu tất cả thông báo đã đọc.
  const markAllNotificationsAsRead = useRealtimeStore(state => state.markAllNotificationsAsRead)

  // Lấy hàm hiển thị MessageBox toàn cục khi gọi API lỗi.
  const showMessage = useMessageBoxStore(state => state.showMessage)

  // Trạng thái loading riêng cho request API, tránh phụ thuộc vào trạng thái SignalR.
  const [loading, setLoading] = useState(true)

  // Khi vào trang, tải danh sách thông báo từ API rồi ghi vào store realtime.
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      try {
        // safeApiCall giúp bắt lỗi backend/mạng và hiện MessageBox thay vì crash.
        const data = await safeApiCall(
          () => apiClient.notifications.getAll(),
          'Không thể tải danh sách thông báo.',
          showMessage,
        )

        // Nếu API trả dữ liệu thì ghi vào store để UI realtime đồng bộ.
        if (data) {
          setNotifications(data)
        }
      } finally {
        setLoading(false)
      }
    }

    // Gọi tải dữ liệu khi component mount.
    void loadNotifications()
  }, [setNotifications, showMessage])

  // Khi user bấm đánh dấu tất cả đã đọc, gọi API trong try-catch.
  const markAllRead = async () => {
    const result = await safeApiCall(
      () => apiClient.notifications.markAllAsRead(),
      'Không thể đánh dấu thông báo đã đọc.',
      showMessage,
    )

    if (!result) {
      return
    }

    markAllNotificationsAsRead()
    showMessage('success', 'Đã đánh dấu tất cả thông báo là đã đọc.')
  }

  // Chỉ hiển thị loading trong lúc request API đang chạy.
  const isLoading = loading

  if (isLoading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Thông báo
          {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
        </h1>
        {unreadCount > 0 && (
          <button style={styles.markBtn} onClick={markAllRead}>Đánh dấu tất cả đã đọc</button>
        )}
      </div>

      {notifications.length === 0
        ? <p style={styles.empty}>Không có thông báo nào.</p>
        : (
          <div style={styles.list}>
            {notifications.map(n => (
              <div key={n.id} style={{ ...styles.item, ...(n.isRead ? {} : styles.unread) }}>
                <div style={styles.dot}>{n.isRead ? '○' : '●'}</div>
                <div style={styles.content}>
                  <p style={styles.message}>{n.message}</p>
                  <p style={styles.time}>{new Date(n.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 },
  badge: { backgroundColor: '#1DB954', color: '#000', fontSize: 12, fontWeight: 700, borderRadius: 10, padding: '2px 8px' },
  markBtn: { backgroundColor: 'transparent', color: '#1DB954', border: '1px solid #1DB954', borderRadius: 20, padding: '8px 16px', cursor: 'pointer', fontSize: 13 },
  list: { display: 'flex', flexDirection: 'column', gap: 2 },
  item: { display: 'flex', gap: 14, padding: '14px 16px', borderRadius: 8, alignItems: 'flex-start' },
  unread: { backgroundColor: '#1a1a1a' },
  dot: { color: '#1DB954', fontSize: 10, marginTop: 4, flexShrink: 0 },
  content: {},
  message: { fontSize: 14, marginBottom: 4 },
  time: { fontSize: 12, color: '#b3b3b3' },
  empty: { color: '#b3b3b3', fontSize: 14 },
}