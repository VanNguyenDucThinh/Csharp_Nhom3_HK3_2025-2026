// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', icon: '🏠', label: 'Trang chủ' },
  { to: '/search', icon: '🔍', label: 'Tìm kiếm' },
  { to: '/library', icon: '📚', label: 'Thư viện' },
]

const secondaryItems = [
  { to: '/notifications', icon: '🔔', label: 'Thông báo' },
  { to: '/share-inbox', icon: '📨', label: 'Chia sẻ' },
  { to: '/profile', icon: '👤', label: 'Hồ sơ' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <div style={styles.container}>
      {/* Logo */}
      <h2 style={styles.logo}>TuneVault</h2>

      {/* Nav chính */}
      <nav style={styles.nav}>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...styles.link,
              ...(location.pathname === item.to ? styles.activeLink : {}),
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={styles.divider} />

      {/* Nav phụ */}
      <nav style={styles.nav}>
        {secondaryItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...styles.link,
              ...(location.pathname === item.to ? styles.activeLink : {}),
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '20px 12px', backgroundColor: '#121212', height: '100%', display: 'flex', flexDirection: 'column' },
  logo: { color: '#1DB954', marginBottom: 28, paddingLeft: 12, fontSize: 20, letterSpacing: '-0.5px' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  link: { display: 'flex', alignItems: 'center', gap: 12, color: '#b3b3b3', textDecoration: 'none', fontSize: 14, fontWeight: 600, padding: '10px 12px', borderRadius: 6 },
  activeLink: { color: '#ffffff', backgroundColor: '#282828' },
  icon: { fontSize: 18, width: 24, textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#282828', margin: '16px 0' },
}