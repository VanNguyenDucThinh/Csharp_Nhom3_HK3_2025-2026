// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import apiClient, { showApiError } from "../api/apiClient.ts";
import type { ProfileUserDto as User } from "../types/User.ts";
import authService from "../authService.ts";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "../components/profile/EditProfileModal.tsx";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        // Lấy hồ sơ từ backend; nếu lỗi thì dùng dữ liệu đã lưu trong localStorage.
        const data = await apiClient.profile.getMe();
        setUser(data);
      } catch (err) {
        // Backend lỗi không được làm crash trang; vẫn báo lỗi cho user biết.
        const localUser = authService.getCurrentUser();
        setUser(
          localUser
            ? { id: localUser.id, name: localUser.name, avatarUrl: "", bio: "" }
            : null,
        );
        showApiError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleEditSuccess = (updatedUser: User) => {
    setUser(updatedUser);
    // Update localStorage with new user data
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, name: updatedUser.name }),
      );
    }
  };

  if (loading)
    return <div style={{ padding: 40, color: "#b3b3b3" }}>Đang tải...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 48 }}>👤</span>
          )}
        </div>
        <div style={styles.headerContent}>
          <p style={styles.label}>Hồ sơ</p>
          <h1 style={styles.name}>{user?.name ?? "Người dùng"}</h1>
          <p style={styles.email}>
            {authService.getCurrentUser()?.email ?? ""}
          </p>
        </div>
        <div style={styles.buttonContainer}>
          <button
            style={styles.editBtn}
            onClick={() => setIsEditModalOpen(true)}
          >
            Chỉnh sửa
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      {user?.bio && <p style={styles.bio}>{user.bio}</p>}

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "24px 32px", color: "#fff" },
  header: {
    display: "flex",
    gap: 24,
    alignItems: "flex-end",
    marginBottom: 32,
    padding: 24,
    background: "linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), #4a4a4a",
    borderRadius: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    backgroundColor: "#282828",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  headerContent: { flex: 1 },
  label: {
    color: "#b3b3b3",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  name: { fontSize: 36, fontWeight: 700, marginBottom: 4 },
  email: { color: "#b3b3b3", fontSize: 14 },
  bio: { color: "#b3b3b3", fontSize: 14, marginBottom: 32 },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-start",
  },
  editBtn: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #535353",
    borderRadius: 20,
    padding: "10px 24px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    transition: "all 0.2s",
  },
  logoutBtn: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #535353",
    borderRadius: 20,
    padding: "10px 24px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
