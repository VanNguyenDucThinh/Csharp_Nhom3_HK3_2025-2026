// src/pages/Notifications.tsx
import { useEffect, useState } from 'react'
import apiClient, { showApiError } from '../api/apiClient.ts'
import { Read } from '../types/Notification.ts'
import type { NotificationDto as Notification } from '../types/Notification.ts'

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Gọi API thông báo trong try-catch để backend lỗi không làm crash app.
        const data = await apiClient.notification.getAll()
        setNotifications(data)
      } catch (err) {
        // Nếu backend sập hoặc mất mạng, hiện MessageBox dạng alert.
        showApiError(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const markAllRead = async () => {
    try {
      const unread = notifications.filter(n => n.isRead !== Read.Read)
      await Promise.all(unread.map(n => apiClient.notification.markAsRead(n.id)))
      setNotifications(prev => prev.map(n => ({ ...n, isRead: Read.Read })))
    } catch (err) {
      // Nếu đánh dấu đã đọc thất bại, vẫn giữ thông báo và báo lỗi cho user.
      showApiError(err)
    }
  }

  const unreadCount = notifications.filter(n => n.isRead !== Read.Read).length

  if (loading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>

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
                  <p style={styles.message}>{n.payload}</p>
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