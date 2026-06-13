import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import PlayerBar from './PlayerBar'
import RightPanel from './RightPanel'
import MobileNav from './MobileNav'
import CompactPlayer from './CompactPlayer'

// MainLayout bọc tất cả trang có layout Spotify:
// [ Sidebar | Nội dung trang | RightPanel ]
//        [ PlayerBar cố định phía dưới ]

export default function MainLayout() {
  // Dùng state để biết menu mobile đang mở hay đóng.
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      {/* Sidebar chỉ hiển thị từ màn hình medium trở lên. */}
      <aside className="hidden h-full w-60 border-r border-gray-800 md:flex">
        <Sidebar />
      </aside>

      {/* Nội dung chính co giãn, có padding dưới để không bị bottom nav che. */}
      <main className="flex-1 overflow-y-auto bg-[#121212] pb-36 md:pb-0">
        {/* Nút hamburger chỉ hiện trên mobile. */}
        <button
          className="fixed left-4 top-4 z-40 rounded-md bg-gray-800 px-3 py-2 md:hidden"
          onClick={() => setIsMenuOpen(true)}
        >
          ☰
        </button>

        <Outlet />
      </main>

      {/* RightPanel chỉ hiện trên màn hình lớn. */}
      <aside className="hidden h-full w-80 border-l border-gray-800 xl:flex">
        <RightPanel />
      </aside>

      {/* Overlay đen khi mở menu mobile. */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Ngăn click trong menu làm đóng overlay. */}
          <div
            className="h-full w-72 bg-black p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="mb-4 rounded-md bg-gray-800 px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Đóng
            </button>

            <Sidebar />
          </div>
        </div>
      )}

      {/* Full PlayerBar chỉ hiện từ màn hình medium trở lên. */}
      <div className="fixed inset-x-0 bottom-0 z-30 hidden md:block">
        <PlayerBar />
      </div>

      {/* Compact Player + Bottom Nav chỉ hiện trên mobile. */}
      <div className="fixed inset-x-0 bottom-0 z-30 md:hidden">
        <CompactPlayer />
        <MobileNav />
      </div>
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