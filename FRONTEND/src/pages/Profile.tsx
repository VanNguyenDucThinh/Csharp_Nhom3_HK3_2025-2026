// src/pages/Profile.tsx
import { useEffect, useState } from 'react'
import apiClient from '../api/apiClient'
import type { User } from '../types/tuneVault'
import authService from '../authService'
import { useNavigate } from 'react-router-dom'
import { useMessageBoxStore } from '../stores/messageBoxStore'
import { safeApiCall } from '../utils/safeApiCall'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const showMessage = useMessageBoxStore(state => state.showMessage)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await safeApiCall(
          () => apiClient.profile.getMe(),
          'Không thể tải hồ sơ cá nhân.',
          showMessage,
        )

        setUser(data ?? authService.getCurrentUser())
      } finally {
        setLoading(false)
      }
    }

    void loadProfile()
  }, [showMessage])

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  if (loading) return <div style={{ padding: 40, color: '#b3b3b3' }}>Đang tải...</div>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: 48 }}>👤</span>
          }
        </div>
        <div>
          <p style={styles.label}>Hồ sơ</p>
          <h1 style={styles.name}>{user?.username ?? 'Người dùng'}</h1>
          <p style={styles.email}>{user?.email}</p>
        </div>
      </div>

      {user?.bio && <p style={styles.bio}>{user.bio}</p>}

      <button style={styles.logoutBtn} onClick={handleLogout}>Đăng xuất</button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '24px 32px', color: '#fff' },
  header: { display: 'flex', gap: 24, alignItems: 'flex-end', marginBottom: 32, padding: 24, background: 'linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), #4a4a4a', borderRadius: 8 },
  avatar: { width: 120, height: 120, borderRadius: '50%', backgroundColor: '#282828', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  label: { color: '#b3b3b3', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  name: { fontSize: 36, fontWeight: 700, marginBottom: 4 },
  email: { color: '#b3b3b3', fontSize: 14 },
  bio: { color: '#b3b3b3', fontSize: 14, marginBottom: 32 },
  logoutBtn: { backgroundColor: 'transparent', color: '#fff', border: '1px solid #535353', borderRadius: 20, padding: '10px 24px', cursor: 'pointer', fontWeight: 600 },
}