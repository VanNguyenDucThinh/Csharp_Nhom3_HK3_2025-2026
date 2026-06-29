// src/components/profile/EditProfileModal.tsx
import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient.ts";
import type { ProfileUserDto } from "../../types/User.ts";

interface EditProfileModalProps {
  user: ProfileUserDto | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: ProfileUserDto) => void;
}

export default function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditProfileModalProps) {
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio]   = useState(user?.bio ?? "");

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword]         = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hienMatKhauCu, setHienMatKhauCu]     = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(user?.name ?? "");
      setBio(user?.bio ?? "");
      setShowPasswordSection(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setHienMatKhauCu(false);
      setError("");
    }
  }, [isOpen]); 

  if (!isOpen) return null;




















  
  // ── Validate mật khẩu mới ────────────────────────────────────
  const kiemTraMatKhauMoi = (matKhau: string): boolean => {
    if (!matKhau) return false;
    return (
      /[A-Z]/.test(matKhau) &&
      /[a-z]/.test(matKhau) &&
      /[0-9]/.test(matKhau) &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(matKhau) &&
      matKhau.length >= 8
    );
  };

  // ── FIX: Thêm điều kiện mật khẩu mới KHÔNG được trùng với cũ ─
  const kiemTraKhacMatKhauCu = (matKhauMoi: string): boolean => {
    // Chỉ check khi cả 2 ô đã có giá trị
    if (!matKhauMoi || !oldPassword) return true;
    return matKhauMoi !== oldPassword;
  };

  const kiemTraForm = (): boolean => {
    setError("");

    if (showPasswordSection) {
      if (!oldPassword) { setError("Vui lòng nhập mật khẩu cũ."); return false; }
      if (!newPassword) { setError("Vui lòng nhập mật khẩu mới."); return false; }

      // ── Kiểm tra không trùng mật khẩu cũ ─────────────────────
      if (!kiemTraKhacMatKhauCu(newPassword)) {
        setError("Mật khẩu mới không được trùng với mật khẩu cũ.");
        return false;
      }

      if (!kiemTraMatKhauMoi(newPassword)) {
        setError("Mật khẩu mới phải chứa chữ hoa, chữ thường, số, ký tự đặc biệt và tối thiểu 8 ký tự.");
        return false;
      }
      if (newPassword !== confirmPassword) {
        setError("Mật khẩu xác nhận không trùng khớp.");
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!kiemTraForm()) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("Name", name.trim() || (user?.name ?? ""));
      if (bio.trim()) formData.append("Bio", bio.trim());

      const ketQua = await apiClient.profile.update(formData);
      onSuccess(ketQua);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Cập nhật profile thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    // useEffect sẽ tự reset form khi isOpen đổi thành false → true lần sau
  };

  return (
    <div style={styles.overlay} onClick={handleCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Chỉnh sửa profile</h2>

        {/* ── Tên ──────────────────────────────────────────────── */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên của bạn"
            style={styles.input}
            disabled={loading}
          />
        </div>

        {/* ── Tiểu sử ──────────────────────────────────────────── */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Tiểu sử</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Nhập tiểu sử của bạn"
            style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
            disabled={loading}
          />
        </div>

        {/* ── Toggle section đổi mật khẩu ──────────────────────── */}
        <div style={styles.formGroup}>
          <button
            style={styles.passwordToggleBtn}
            onClick={() => {
              setShowPasswordSection(!showPasswordSection);
              if (showPasswordSection) {
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setHienMatKhauCu(false);
              }
            }}
          >
            {showPasswordSection ? "▼ Ẩn" : "▶ Đổi mật khẩu"}
          </button>
        </div>

        {showPasswordSection && (
          <div style={styles.passwordSection}>

            {/* Thông báo tính năng đang phát triển */}
            <div style={styles.infoBox}>
              ℹ️ Tính năng đổi mật khẩu đang được phát triển. Các thay đổi về tên và tiểu sử vẫn được lưu bình thường khi bấm Lưu.
            </div>

            {/* ── Mật khẩu cũ — CÓ con mắt ───────────────────── */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Mật khẩu cũ</label>
              <div style={styles.inputWrapper}>
                <input
                  type={hienMatKhauCu ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  style={{ ...styles.input, paddingRight: 44, marginBottom: 0 }}
                  disabled={loading}
                />
                <button
                  style={styles.eyeBtn}
                  onClick={() => setHienMatKhauCu(!hienMatKhauCu)}
                  type="button"
                  tabIndex={-1}
                >
                  {hienMatKhauCu ? (
                        // Icon Mắt Mở (Show)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      ) : (
                        // Icon Mắt Gạch Chéo (Hide)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      )}
                </button>
              </div>
            </div>

            {/* ── Mật khẩu mới — KHÔNG có con mắt ─────────────── */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới"
                style={styles.input}
                disabled={loading}
              />
              {/* Hint realtime — hiện ngay khi đang nhập */}
              {newPassword && !kiemTraKhacMatKhauCu(newPassword) && (
                <p style={styles.hintText}>Mật khẩu mới không được trùng với mật khẩu cũ</p>
              )}
              {newPassword && kiemTraKhacMatKhauCu(newPassword) && !kiemTraMatKhauMoi(newPassword) && (
                <p style={styles.hintText}>
                  Cần có: chữ hoa, chữ thường, số, ký tự đặc biệt, tối thiểu 8 ký tự
                </p>
              )}
              {newPassword && kiemTraKhacMatKhauCu(newPassword) && kiemTraMatKhauMoi(newPassword) && (
                <p style={styles.okText}>✓ Mật khẩu hợp lệ</p>
              )}
            </div>

            {/* ── Xác nhận mật khẩu — KHÔNG có con mắt ─────────── */}
            <div style={{ ...styles.formGroup, marginBottom: 0 }}>
              <label style={styles.label}>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                style={styles.input}
                disabled={loading}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p style={styles.hintText}>Mật khẩu xác nhận không trùng khớp</p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p style={styles.okText}>✓ Trùng khớp</p>
              )}
            </div>

          </div>
        )}

        {error && <p style={styles.errorMessage}>⚠️ {error}</p>}

        <div style={styles.buttonGroup}>
          <button style={styles.cancelBtn} onClick={handleCancel} disabled={loading}>
            Hủy
          </button>
          <button
            style={{ ...styles.saveBtn, ...(loading ? styles.btnDisabled : {}) }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay:      { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal:        { backgroundColor: "#282828", borderRadius: 8, padding: 32, maxWidth: 500, width: "90%", maxHeight: "90vh", overflow: "auto", color: "#fff" },
  title:        { fontSize: 24, fontWeight: 700, marginBottom: 24, color: "#fff" },
  formGroup:    { marginBottom: 20 },
  label:        { display: "block", color: "#b3b3b3", fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  input:        { width: "100%", padding: "10px 12px", backgroundColor: "#404040", border: "1px solid #535353", borderRadius: 4, color: "#fff", fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  eyeBtn:       { position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#b3b3b3", padding: "0 4px", lineHeight: 1 },
  hintText:     { color: "#f78482", fontSize: 12, marginTop: 4 },
  okText:       { color: "#1db954", fontSize: 12, marginTop: 4 },
  infoBox:      { backgroundColor: "rgba(29,185,84,0.1)", border: "1px solid rgba(29,185,84,0.3)", borderRadius: 4, padding: "10px 12px", fontSize: 12, color: "#b3b3b3", marginBottom: 16, lineHeight: 1.5 },
  errorMessage: { color: "#f78482", fontSize: 13, padding: 12, backgroundColor: "rgba(247,132,130,0.1)", borderRadius: 4, marginBottom: 20 },
  passwordToggleBtn: { backgroundColor: "transparent", color: "#1db954", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 },
  passwordSection:   { backgroundColor: "#333", padding: 16, borderRadius: 4, marginBottom: 20 },
  buttonGroup:  { display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 32 },
  saveBtn:      { backgroundColor: "#1db954", color: "#fff", border: "none", borderRadius: 20, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14 },
  cancelBtn:    { backgroundColor: "transparent", color: "#b3b3b3", border: "1px solid #535353", borderRadius: 20, padding: "10px 24px", cursor: "pointer", fontWeight: 600, fontSize: 14 },
  btnDisabled:  { opacity: 0.6, cursor: "not-allowed" },
};