// src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import Search from "./pages/Search.tsx";
import Library from "./pages/Library.tsx";
import FavoriteSongs from "./pages/FavoriteSongs.tsx";
import PlaylistDetail from "./pages/PlaylistDetail.tsx";
import Profile from "./pages/Profile.tsx";
import Notifications from "./pages/Notifications.tsx";
import ShareInbox from "./pages/ShareInbox.tsx";
import Upload from "./pages/Upload.tsx";

function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
        <Route path="favorites" element={<FavoriteSongs />} />
        <Route path="upload" element={<Upload />} />
        <Route path="playlist/:id" element={<PlaylistDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="share-inbox" element={<ShareInbox />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
