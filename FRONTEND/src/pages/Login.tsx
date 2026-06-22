// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../authService'

// Chế độ mock — tắt đi khi backend sẵn sàng.
const USE_MOCK = true

const previewItems = [
  { title: 'Trending Now', desc: 'Bản hit đang được nghe nhiều nhất' },
  { title: 'Your Library', desc: 'Playlist và bài hát yêu thích' },
  { title: 'Friends Activity', desc: 'Bạn bè đang nghe gì' },
  { title: 'Upload', desc: 'Tải lên nhạc và video' },
]

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!username || !password) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setLoading(true)
    setError('')
    try {
      if (USE_MOCK) {
        // Giả lập login thành công để test giao diện khi backend chưa có thật.
        localStorage.setItem('token', 'mock-token-123')
        localStorage.setItem('user', JSON.stringify({ id: '1', username, email: email || `${username}@test.com` }))
        navigate('/')
      } else {
        await authService.login({ username, password })
        navigate('/')
      }
    } catch {
      // Lỗi đăng nhập được hiển thị ngay trong form, không dùng MessageBox/alert.
      setError('Tên đăng nhập hoặc mật khẩu không đúng.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!username || !email || !password) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setLoading(true)
    setError('')
    try {
      if (USE_MOCK) {
        // Giả lập đăng ký thành công để test giao diện khi backend chưa có thật.
        localStorage.setItem('token', 'mock-token-123')
        localStorage.setItem('user', JSON.stringify({ id: '1', username, email }))
        navigate('/')
      } else {
        await authService.register({ username, email, password })
        navigate('/')
      }
    } catch {
      // Lỗi đăng ký được hiển thị ngay trong form, không dùng MessageBox/alert.
      setError('Đăng ký thất bại. Tên đăng nhập hoặc email đã tồn tại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Lớp nền giả lập giao diện app phía sau modal để tạo cảm giác mặt nạ trong suốt. */}
      <div style={styles.backgroundPreview} aria-hidden="true">
        {previewItems.map(item => (
          <div key={item.title} style={styles.previewCard}>
            <div style={styles.previewIcon}>♪</div>
            <div>
              <div style={styles.previewTitle}>{item.title}</div>
              <div style={styles.previewDesc}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay mờ + blur, vẫn cho thấy rõ giao diện đang bị che phía sau. */}
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.logo}>TuneVault</h1>
          <p style={styles.sub}>Đăng nhập hoặc tạo tài khoản để tiếp tục nghe nhạc</p>

          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(tab === 'login' ? styles.activeTab : {}) }}
              onClick={() => { setTab('login'); setError('') }}
            >
              Đăng nhập
            </button>
            <button
              style={{ ...styles.tab, ...(tab === 'register' ? styles.activeTab : {}) }}
              onClick={() => { setTab('register'); setError('') }}
            >
              Đăng ký
            </button>
          </div>

          {/* Form */}
          <div style={styles.form}>
            <input
              style={styles.input}
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            {tab === 'register' && (
              <input
                style={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            )}

            <input
              style={styles.input}
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())}
            />

            {error && <div style={styles.error}>{error}</div>}

            {USE_MOCK && (
              <div style={styles.mockNote}>
                Chế độ thử nghiệm — Backend chưa kết nối
              </div>
            )}

            <button
              style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
              onClick={tab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  backgroundPreview: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
    padding: 48,
    opacity: 0.72,
  },
  previewCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    borderRadius: 18,
    padding: 24,
    backgroundColor: 'rgba(18,18,18,0.88)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#1DB954',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 800,
    flexShrink: 0,
  },
  previewTitle: { color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 4 },
  previewDesc: { color: '#b3b3b3', fontSize: 13 },
  overlay: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 24,
    backgroundColor: 'rgba(0,0,0,0.46)',
    backdropFilter: 'blur(8px)',
  },
  card: {
    backgroundColor: '#ffffff',
    color: '#121212',
    padding: '44px 36px',
    borderRadius: 18,
    width: 420,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
  },
  logo: { color: '#1DB954', fontSize: 34, fontWeight: 800, textAlign: 'center', margin: '0 0 8px' },
  sub: { color: '#535353', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  tabs: { display: 'flex', backgroundColor: '#f1f1f2', borderRadius: 10, padding: 4, marginBottom: 22 },
  tab: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#535353', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  activeTab: { backgroundColor: '#ffffff', color: '#121212', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { backgroundColor: '#f6f6f6', border: '1px solid #e5e5e5', borderRadius: 8, padding: '14px 16px', color: '#121212', fontSize: 14, outline: 'none' },
  error: { color: '#f15e6c', fontSize: 13, textAlign: 'center', margin: '2px 0', padding: '8px 10px', borderRadius: 8, backgroundColor: '#fff0f1' },
  mockNote: { color: '#7a5a00', fontSize: 12, textAlign: 'center', backgroundColor: '#fff7d6', borderRadius: 8, padding: '8px', margin: '0' },
  btn: { backgroundColor: '#1DB954', color: '#000', border: 'none', borderRadius: 50, padding: 15, fontWeight: 800, fontSize: 15, cursor: 'pointer', marginTop: 4 },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
}
