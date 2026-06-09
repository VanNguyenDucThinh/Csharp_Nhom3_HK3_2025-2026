import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'

// Pages
import Login from './pages/Login'
import Home from './pages/Home'
import Search from './pages/Search'
import Library from './pages/Library'
import PlaylistDetail from './pages/PlaylistDetail'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import ShareInbox from './pages/ShareInbox'

// Kiểm tra user đã đăng nhập chưa (tạm dùng localStorage)
function isAuthenticated(): boolean {
  return !!localStorage.getItem('token')
}

// Route được bảo vệ — chưa login thì về trang Login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes — dùng MainLayout (có Sidebar + PlayerBar) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="library" element={<Library />} />
        <Route path="playlist/:id" element={<PlaylistDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="share-inbox" element={<ShareInbox />} />
      </Route>

      {/* Fallback — trang không tồn tại thì về Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}