// src/components/layout/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const mockPlaylists = [
  { id: 1, name: 'Nhạc yêu thích' },
  { id: 2, name: 'Chill Vibes' },
  { id: 3, name: 'Workout Mix' },
]

// ---- SVG Icons ----
function HomeIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z"/></svg>
}
function SearchIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
}
function UploadIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
}
function LibraryIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
}
function PlusIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
}
function MusicIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
}
function BellIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
}
function ShareIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
}
function PersonIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
}

const navItems = [
  { to: '/', icon: <HomeIcon />, label: 'Trang chủ' },
  { to: '/search', icon: <SearchIcon />, label: 'Tìm kiếm' },
  { to: '/upload', icon: <UploadIcon />, label: 'Tải lên' },
]

const bottomItems = [
  { to: '/notifications', icon: <BellIcon />, label: 'Thông báo' },
  { to: '/share-inbox', icon: <ShareIcon />, label: 'Chia sẻ' },
  { to: '/profile', icon: <PersonIcon />, label: 'Hồ sơ' },
]

// Component link có hover effect
function NavLink({ to, icon, label, active }: {
  to: string; icon: React.ReactNode; label: string; active: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <Link
      to={to}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        textDecoration: 'none', fontSize: 15, fontWeight: 700,
        padding: '10px 8px', borderRadius: 6,
        color: active ? '#ffffff' : hovered ? '#ffffff' : '#b3b3b3',
        backgroundColor: pressed ? '#3a3a3a' : hovered ? '#1a1a1a' : 'transparent',
        transform: pressed ? 'scale(0.97)' : 'scale(1)',
        transition: 'color 0.15s, background-color 0.15s, transform 0.1s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

// Component playlist item có hover effect
function PlaylistLink({ id, name, active }: { id: number; name: string; active: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <Link
      to={`/playlist/${id}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px', borderRadius: 6,
        textDecoration: 'none',
        backgroundColor: active ? '#282828' : pressed ? '#333' : hovered ? '#1a1a1a' : 'transparent',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'background-color 0.15s, transform 0.1s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 4,
        backgroundColor: hovered ? '#383838' : '#282828',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, color: '#b3b3b3',
        transition: 'background-color 0.15s',
      }}>
        <MusicIcon />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, color: '#b3b3b3' }}>Playlist</div>
      </div>
    </Link>
  )
}

// Component nút + (tạo playlist)
function PlusButton({ to }: { to: string }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <Link
      to={to}
      title="Tạo playlist"
      style={{
        color: hovered ? '#ffffff' : '#b3b3b3',
        display: 'flex', alignItems: 'center',
        padding: 6, borderRadius: '50%',
        textDecoration: 'none',
        backgroundColor: pressed ? '#3a3a3a' : hovered ? '#282828' : 'transparent',
        transform: pressed ? 'scale(0.9)' : 'scale(1)',
        transition: 'color 0.15s, background-color 0.15s, transform 0.1s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <PlusIcon />
    </Link>
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
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
          />
        ))}
      </div>

      {/* Thư viện */}
      <div style={styles.libraryBox}>
        <div style={styles.libraryHeader}>
          <NavLink
            to="/library"
            icon={<LibraryIcon />}
            label="Thư viện"
            active={location.pathname === '/library'}
          />
          <PlusButton to="/library" />
        </div>

        {/* Danh sách playlist */}
        <div style={styles.playlistList}>
          {playlists.map(pl => (
            <PlaylistLink
              key={pl.id}
              id={pl.id}
              name={pl.name}
              active={location.pathname === `/playlist/${pl.id}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom links */}
      <div style={styles.bottomNav}>
        {bottomItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.to}
          />
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
  libraryBox: {
    flex: 1, overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    margin: '0 8px',
  },
  libraryHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
  },
  playlistList: { flex: 1, overflowY: 'auto', padding: '4px 0' },
  bottomNav: {
    padding: '8px',
    borderTop: '1px solid #282828',
    display: 'flex', flexDirection: 'column', gap: 2,
  },
}