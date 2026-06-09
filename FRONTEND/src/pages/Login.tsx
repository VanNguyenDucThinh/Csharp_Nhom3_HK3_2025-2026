import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin() {
    // TODO: gọi API thật sau khi backend sẵn sàng
    // Hiện tại lưu token giả để test layout
    localStorage.setItem('token', 'fake-token-for-testing')
    navigate('/')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>TuneVault</h1>
        <p style={styles.sub}>Đăng nhập để tiếp tục nghe nhạc</p>

        <input
          style={styles.input}
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.btn} onClick={handleLogin}>
          Đăng nhập
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#000000',
  },
  card: {
    backgroundColor: '#121212',
    padding: '48px 40px',
    borderRadius: 12,
    width: 360,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  logo: {
    color: '#1DB954',
    fontSize: 32,
    fontWeight: 700,
    textAlign: 'center',
    margin: 0,
  },
  sub: {
    color: '#b3b3b3',
    fontSize: 14,
    textAlign: 'center',
    margin: 0,
  },
  input: {
    backgroundColor: '#2a2a2a',
    border: '1px solid #3a3a3a',
    borderRadius: 6,
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: 14,
    outline: 'none',
  },
  btn: {
    backgroundColor: '#1DB954',
    color: '#000000',
    border: 'none',
    borderRadius: 50,
    padding: '14px',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    marginTop: 8,
  },
}