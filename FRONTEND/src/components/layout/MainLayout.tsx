// src/components/layout/MainLayout.tsx
import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.tsx'
import PlayerBar from './PlayerBar.tsx'
import RightPanel from './RightPanel.tsx'
import FriendActivity from './FriendActivity.tsx'
import TopHeader from './TopHeader.tsx'

// Icon thu gọn/mở rộng sidebar (mũi tên)
function CollapseIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {direction === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

type RightPanelMode = 'nowplaying' | 'friends' | null

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>('nowplaying')
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [isResizingRightPanel, setIsResizingRightPanel] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{"username":"T"}')

  const handleBellClick = () => {
    if (location.pathname === '/notifications') navigate('/')
    else navigate('/notifications')
  }
  const handleFriendsClick = () => {
    setRightPanelMode(prev => prev === 'friends' ? 'nowplaying' : 'friends')
  }
  const handleProfileClick = () => navigate('/profile')
  const handleLogoClick = () => navigate('/')

  const isOnNotifications = location.pathname === '/notifications'
  const isOnProfile = location.pathname === '/profile'

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRightPanel) return
      // Chỉ tính lại chiều rộng của Right Panel, không thay đổi chiều cao hay zoom nội dung.
      const nextWidth = window.innerWidth - e.clientX
      const safeWidth = Math.min(Math.max(nextWidth, 260), 560)
      setRightPanelWidth(safeWidth)
    }

    const handleMouseUp = () => {
      setIsResizingRightPanel(false)
      document.body.style.cursor = ''
    }

    if (isResizingRightPanel) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }
  }, [isResizingRightPanel])

  const startResizeRightPanel = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizingRightPanel(true)
  }

  const closeRightPanel = () => {
    setRightPanelMode(null)
  }

  const openRightPanel = () => {
    setRightPanelMode('nowplaying')
  }

  return (
    <div style={styles.root}>
      <header style={styles.headerArea}>
        <TopHeader
          onBellClick={handleBellClick}
          onFriendsClick={handleFriendsClick}
          onProfileClick={handleProfileClick}
          onLogoClick={handleLogoClick}
          bellActive={isOnNotifications}
          friendsActive={rightPanelMode === 'friends'}
          profileActive={isOnProfile}
          username={user.username}
        />
      </header>

      <div
        style={{
          ...styles.body,
          gridTemplateColumns: `${sidebarCollapsed ? '72px' : '240px'} 1fr ${rightPanelMode ? `${rightPanelWidth}px` : '0px'}`,
        }}
      >
        <aside style={styles.sidebarArea}>
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(false)}
            onCollapse={() => setSidebarCollapsed(true)}
          />
        </aside>

        <main style={styles.main}>
          <Outlet />
        </main>

        {rightPanelMode && (
          <aside style={styles.rightPanelArea}>
            <div
              className="right-panel-resize-handle"
              onMouseDown={startResizeRightPanel}
              title="Kéo để thay đổi chiều rộng Right Panel"
            />
            {rightPanelMode === 'friends'
              ? <FriendActivity onClose={closeRightPanel} />
              : <RightPanel onClose={closeRightPanel} />
            }
          </aside>
        )}

        {!rightPanelMode && (
          <div style={styles.closedRightPanelOverlay}>
            <button
              className="btn-icon"
              style={styles.reopenRightBtn}
              onClick={openRightPanel}
              title="Mở panel"
            >
              <CollapseIcon direction="left" />
            </button>
          </div>
        )}
      </div>

      <footer style={styles.playerBar}>
        <PlayerBar />
      </footer>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    overflow: 'hidden',
  },
  headerArea: { flexShrink: 0, width: '100%' },
  body: {
    display: 'grid',
    flex: 1,
    minHeight: 0,
    position: 'relative',
    transition: 'grid-template-columns 0.15s ease',
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
    gap: 8,
  },
  sidebarArea: {
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#121212',
    borderRadius: 8,
    minHeight: 0,
  },
  main: {
    overflowY: 'auto',
    backgroundColor: '#121212',
    position: 'relative',
    zIndex: 1,
    borderRadius: 8,
    minHeight: 0,
  },
  rightPanelArea: {
    overflow: 'hidden',
    backgroundColor: '#121212',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 5,
    boxShadow: '-8px 0 24px rgba(0,0,0,0.45)',
    borderRadius: 8,
    height: '100%',
    minWidth: 0,
    minHeight: 0,
  },
  closedRightPanelOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 56,
    backgroundColor: 'rgba(18,18,18,0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  playerBar: {
    flexShrink: 0, height: 90,
    borderTop: '1px solid #282828',
    width: '100%',
    marginTop: 8,
  },
  collapseBtnLeft: { position: 'absolute', top: 16, right: 12, backgroundColor: '#1a1a1a' },
  reopenRightBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(18,18,18,0.9)',
    zIndex: 10,
  },
}
