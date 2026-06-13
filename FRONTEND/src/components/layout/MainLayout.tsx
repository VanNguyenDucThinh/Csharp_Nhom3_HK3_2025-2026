import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import signalRService from '../../api/signalRService'
import MessageBox from '../common/MessageBox'
import { useMessageBoxStore } from '../../stores/messageBoxStore'
import { useRealtimeStore } from '../../stores/realtimeStore'
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

  // Lấy thông báo toàn cục để hiển thị lỗi realtime từ SignalR.
  const { messageBox, hideMessage } = useMessageBoxStore()

  // Lấy trạng thái kết nối realtime để hiển thị indicator nhỏ cho user.
  const connectionStatus = useRealtimeStore(state => state.connectionStatus)

  // Lấy thông báo lỗi realtime gần nhất để hiển thị rõ nguyên nhân.
  const lastError = useRealtimeStore(state => state.lastError)

  // Khi layout chính mount, kết nối SignalR để nhận dữ liệu realtime.
  useEffect(() => {
    // Hàm async giúp gọi SignalRService mà vẫn bắt lỗi bằng try-catch.
    const connectSignalR = async () => {
      try {
        // Kết nối Hub SignalR sau khi user đã vào vùng protected route.
        await signalRService.connect()
      } catch (error) {
        // Nếu connect ném lỗi, hiển thị MessageBox thay vì để app crash.
        const message = error instanceof Error ? error.message : 'Không thể kết nối realtime.'
        useRealtimeStore.getState().setConnectionStatus('error', message)
        useMessageBoxStore.getState().showMessage('error', message)
      }
    }

    // Gọi kết nối ngay khi MainLayout được render.
    void connectSignalR()

    // Khi MainLayout unmount, ngắt SignalR để giải phóng tài nguyên.
    return () => {
      void signalRService.disconnect()
    }
  }, [])

  // Tạo text hiển thị trạng thái realtime theo từng trạng thái kết nối.
  const connectionText = connectionStatus === 'connected'
    ? 'Realtime đang hoạt động'
    : connectionStatus === 'connecting'
      ? 'Đang kết nối realtime...'
      : connectionStatus === 'reconnecting'
        ? 'Realtime đang kết nối lại...'
        : connectionStatus === 'error'
          ? lastError ?? 'Realtime gặp lỗi'
          : 'Realtime chưa kết nối'

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

      {/* Indicator nhỏ cho trạng thái realtime để user biết kết nối có hoạt động không. */}
      <div
        className="fixed right-4 bottom-24 z-50 rounded-full px-3 py-2 text-xs font-semibold shadow-lg"
        style={{
          backgroundColor: connectionStatus === 'connected' ? '#14532d' : connectionStatus === 'error' ? '#7f1d1d' : '#1e3a8a',
          color: '#ffffff',
        }}
        title={lastError ?? connectionText}
      >
        {connectionText}
      </div>

      {/* MessageBox toàn cục dùng cho lỗi realtime từ SignalR. */}
      {messageBox && (
        <MessageBox
          type={messageBox.type}
          message={messageBox.message}
          onClose={hideMessage}
        />
      )}
    </div>
  )
}
