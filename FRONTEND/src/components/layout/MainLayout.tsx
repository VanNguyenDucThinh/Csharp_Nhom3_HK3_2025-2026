import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import PlayerBar from './PlayerBar'
import RightPanel from './RightPanel'

// MainLayout bọc tất cả trang có layout Spotify:
// [ Sidebar | Nội dung trang | RightPanel ]
//        [ PlayerBar cố định phía dưới ]

export default function MainLayout() {
  return (
    <div style={styles.root}>
      {/* Sidebar bên trái */}
      <aside style={styles.sidebar}>
        <Sidebar />
      </aside>

      {/* Vùng nội dung chính */}
      <main style={styles.main}>
        <Outlet /> {/* Các page sẽ render vào đây */}
      </main>

      {/* Panel bên phải */}
      <aside style={styles.rightPanel}>
        <RightPanel />
      </aside>

      {/* Player bar cố định phía dưới */}
      <footer style={styles.playerBar}>
        <PlayerBar />
      </footer>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr 320px',
    gridTemplateRows: '1fr 90px',
    gridTemplateAreas: `
      "sidebar main rightPanel"
      "playerBar playerBar playerBar"
    `,
    height: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    overflow: 'hidden',
  },
  sidebar: {
    gridArea: 'sidebar',
    overflowY: 'auto',
  },
  main: {
    gridArea: 'main',
    overflowY: 'auto',
    backgroundColor: '#121212',
  },
  rightPanel: {
    gridArea: 'rightPanel',
    overflowY: 'auto',
    backgroundColor: '#000000',
  },
  playerBar: {
    gridArea: 'playerBar',
    borderTop: '1px solid #282828',
  },
}