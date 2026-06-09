import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import chính xác 100% các file từ folder pages của bạn
import Home from './pages/Home.tsx';
import Login from './pages/Login';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetail from './pages/PlaylistDetail';
import SharedInbox from './pages/SharedInbox';
import Notification from './pages/Notification';
import History from './pages/History';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Các tuyến đường Đăng nhập / Đăng ký */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Các tuyến đường chức năng chính của người dùng */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/shared" element={<SharedInbox />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/history" element={<History />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />

        {/* Tuyến đường dành cho Admin quản lý */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Báo lỗi nếu gõ sai đường dẫn URL */}
        <Route path="*" element={<div className="text-white p-5">404 - Không tìm thấy trang</div>} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;