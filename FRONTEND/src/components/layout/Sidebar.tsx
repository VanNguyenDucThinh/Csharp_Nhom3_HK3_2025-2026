import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div style={styles.container}>
      <h2 style={styles.logo}>TuneVault</h2>
      <ul style={styles.menu}>
        <li><Link to="/" style={styles.link}>🏠 Trang chủ</Link></li>
        <li><Link to="/search" style={styles.link}>🔍 Tìm kiếm</Link></li>
        <li><Link to="/library" style={styles.link}>📚 Thư viện</Link></li>
      </ul>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '24px', backgroundColor: '#121212', height: '100%' },
  logo: { color: '#1DB954', marginBottom: '32px' },
  menu: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' },
  link: { color: '#b3b3b3', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }
}