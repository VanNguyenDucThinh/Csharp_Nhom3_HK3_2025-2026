// src/pages/Login.tsx
// Đây là file lưu trữ. Khi Backend làm xong, copy toàn bộ file này vào file Login.tsx để sử dụng
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../authService'
import { useMessageBoxStore } from '../stores/messageBoxStore'

export default function Login() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const showMessage = useMessageBoxStore(state => state.showMessage)

  const handleLogin = async () => {
    if (!username || !password) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setLoading(true); setError('')
    try {
      await authService.login({ username, password })
      navigate('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tên đăng nhập hoặc mật khẩu không đúng.'
      setError(message)
      showMessage('error', message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!username || !email || !password) { setError('Vui lòng điền đầy đủ thông tin.'); return }
    setLoading(true); setError('')
    try {
      await authService.register({ username, email, password })
      navigate('/')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đăng ký thất bại. Tên đăng nhập hoặc email đã tồn tại.'
      setError(message)
      showMessage('error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <h1 style={styles.logo}>TuneVault</h1>
        <p style={styles.sub}>Nền tảng nghe nhạc & xem video của bạn</p>

        {/* Tabs Login / Register */}
        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(tab === 'login' ? styles.activeTab : {}) }} onClick={() => { setTab('login'); setError('') }}>
            Đăng nhập
          </button>
          <button style={{ ...styles.tab, ...(tab === 'register' ? styles.activeTab : {}) }} onClick={() => { setTab('register'); setError('') }}>
            Đăng ký
          </button>
        </div>

        {/* Form */}
        <div style={styles.form}>
          <input style={styles.input} type="text" placeholder="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />

          {tab === 'register' && (
            <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          )}

          <input style={styles.input} type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())}
          />

          {error && <p style={styles.error}>{error}</p>}

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
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#000' },
  card: { backgroundColor: '#121212', padding: '48px 40px', borderRadius: 12, width: 380, display: 'flex', flexDirection: 'column', gap: 0 },
  logo: { color: '#1DB954', fontSize: 32, fontWeight: 700, textAlign: 'center', margin: '0 0 8px' },
  sub: { color: '#b3b3b3', fontSize: 13, textAlign: 'center', marginBottom: 28 },
  tabs: { display: 'flex', backgroundColor: '#282828', borderRadius: 8, padding: 4, marginBottom: 24 },
  tab: { flex: 1, backgroundColor: 'transparent', border: 'none', color: '#b3b3b3', padding: '8px', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  activeTab: { backgroundColor: '#3d3d3d', color: '#fff' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a', borderRadius: 6, padding: '13px 16px', color: '#fff', fontSize: 14, outline: 'none' },
  error: { color: '#f15e6c', fontSize: 13, textAlign: 'center', margin: '4px 0' },
  btn: { backgroundColor: '#1DB954', color: '#000', border: 'none', borderRadius: 50, padding: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4 },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
}