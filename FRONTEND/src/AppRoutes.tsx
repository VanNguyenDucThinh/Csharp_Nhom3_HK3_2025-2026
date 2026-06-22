// src/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import PlaylistDetail from "./pages/PlaylistDetail";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import ShareInbox from "./pages/ShareInbox";
import Upload from "./pages/Upload";

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
