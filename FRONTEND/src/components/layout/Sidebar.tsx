// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: <HomeIcon />, label: 'Trang chủ' },
  { to: '/search', icon: <SearchIcon />, label: 'Tìm kiếm' },
  { to: '/upload', icon: <UploadIcon />, label: 'Tải lên' },
]

// Mock playlist để hiển thị trong sidebar (thay bằng API khi backend sẵn)
const mockPlaylists = [
  { id: 1, name: 'Nhạc yêu thích' },
  { id: 2, name: 'Chill Vibes' },
  { id: 3, name: 'Workout Mix' },
]

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z"/>
    </svg>
  )
}
function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  )
}
function LibraryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
    </svg>
  )
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
  )
}
function MusicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  )
}
function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const [playlists] = useState(mockPlaylists)

  return (
    <div style={styles.container}>
      {/* Logo */}
      <div style={styles.logoBox}>
        <h2 style={styles.logo}>TuneVault</h2>
      </div>

      {/* Nav chính */}
      <div style={styles.navBox}>
        {navItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...styles.navItem,
              ...(location.pathname === item.to ? styles.navActive : {}),
            }}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Thư viện */}
      <div style={styles.libraryBox}>
        {/* Header thư viện */}
        <div style={styles.libraryHeader}>
          <Link
            to="/library"
            style={{
              ...styles.libraryTitle,
              ...(location.pathname === '/library' ? { color: '#fff' } : {}),
            }}
          >
            <span style={styles.navIcon}><LibraryIcon /></span>
            <span>Thư viện</span>
          </Link>
          <Link to="/library" style={styles.addBtn} title="Tạo playlist">
            <PlusIcon />
          </Link>
        </div>

        {/* Danh sách playlist */}
        <div style={styles.playlistList}>
          {playlists.map(pl => (
            <Link
              key={pl.id}
              to={`/playlist/${pl.id}`}
              style={{
                ...styles.playlistItem,
                ...(location.pathname === `/playlist/${pl.id}` ? styles.playlistActive : {}),
              }}
            >
              <div style={styles.playlistIcon}>
                <MusicIcon />
              </div>
              <div>
                <div style={styles.playlistName}>{pl.name}</div>
                <div style={styles.playlistMeta}>Playlist</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom links */}
      <div style={styles.bottomNav}>
        {[
          { to: '/notifications', label: '🔔 Thông báo' },
          { to: '/share-inbox', label: '📨 Chia sẻ' },
          { to: '/profile', label: '👤 Hồ sơ' },
        ].map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              ...styles.bottomItem,
              ...(location.pathname === item.to ? styles.navActive : {}),
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#121212',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  logoBox: { padding: '20px 16px 8px' },
  logo: { color: '#1DB954', fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' },
  navBox: { padding: '4px 8px 8px', display: 'flex', flexDirection: 'column', gap: 2 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    color: '#b3b3b3', textDecoration: 'none',
    fontSize: 15, fontWeight: 700,
    padding: '10px 8px', borderRadius: 6,
  },
  navActive: { color: '#ffffff' },
  navIcon: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  libraryBox: {
    flex: 1, overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    backgroundColor: '#121212',
    borderRadius: 8, margin: '8px',
  },
  libraryHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 8px 8px',
  },
  libraryTitle: {
    display: 'flex', alignItems: 'center', gap: 14,
    color: '#b3b3b3', textDecoration: 'none',
    fontSize: 15, fontWeight: 700,
  },
  addBtn: {
    color: '#b3b3b3', display: 'flex',
    alignItems: 'center', padding: 4, borderRadius: 4,
    textDecoration: 'none',
  },
  playlistList: { flex: 1, overflowY: 'auto', padding: '4px 4px' },
  playlistItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px', borderRadius: 6,
    textDecoration: 'none', color: '#b3b3b3',
  },
  playlistActive: { backgroundColor: '#282828', color: '#fff' },
  playlistIcon: {
    width: 40, height: 40, borderRadius: 4,
    backgroundColor: '#282828', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, color: '#b3b3b3',
  },
  playlistName: { fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 },
  playlistMeta: { fontSize: 11, color: '#b3b3b3' },
  bottomNav: {
    padding: '8px',
    borderTop: '1px solid #282828',
    display: 'flex', flexDirection: 'column', gap: 2,
  },
  bottomItem: {
    display: 'flex', alignItems: 'center',
    gap: 10, padding: '8px 8px',
    color: '#b3b3b3', textDecoration: 'none',
    fontSize: 13, fontWeight: 600, borderRadius: 6,
  },
}