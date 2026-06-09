// src/pages/Profile.tsx
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const navigate = useNavigate()
  
  const handleLogout = () => {
    localStorage.removeItem('token') // Xóa token giả
    navigate('/login') // Đá người dùng về trang đăng nhập
  }

  return (
    <div style={{ padding: '32px', color: '#fff' }}>
      <h1 style={{ marginBottom: 24 }}>Hồ sơ cá nhân</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, backgroundColor: '#181818', padding: 24, borderRadius: 12, maxWidth: 500 }}>
        <img src="https://picsum.photos/150" alt="Avatar" style={{ borderRadius: '50%', border: '4px solid #1DB954' }} />
        <div>
          <h2 style={{ margin: 0 }}>Nguyễn Văn Đức Thịnh</h2>
          <p style={{ color: '#b3b3b3', marginTop: 8, fontSize: 14 }}>Thành viên nhóm đồ án TuneVault</p>
          <span style={{ display: 'inline-block', backgroundColor: '#1DB954', color: '#fff', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 'bold', marginTop: 12 }}>
            Tài khoản PREMIUM
          </span>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        style={{ marginTop: 32, backgroundColor: '#e91429', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 24, fontWeight: 'bold', cursor: 'pointer' }}
      >
        Đăng xuất khỏi hệ thống
      </button>
    </div>
  )
}