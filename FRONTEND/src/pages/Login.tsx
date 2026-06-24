// src/pages/Login.tsx
// ====================================================================
// LOGIN PAGE — Đăng nhập / Đăng ký
// Sửa lỗi: Login gửi { email, password } thay vì { username, password }
// ====================================================================

import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient.ts";

const USE_MOCK = false;

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");

  // --- STATE ---
  // email: dùng cho CẢ login và register (backend đều cần field "email")
  const [email, setEmail] = useState("");
  // username: CHỈ dùng cho register (backend cần "name")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // ====================================================================
  // HANDLER: Đăng nhập
  // ✅ SỬA: Validate email (không phải username) + gửi { email, password }
  // ====================================================================
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt reload page

    // ✅ SỬA: Validate email + password (backend LoginRequest cần cả 2)
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // ✅ Gửi { email, password } khớp LoginRequest C#
      const response = await apiClient.auth.login({ email, password });

      // ✅ FIX QUAN TRỌNG: Lưu token vào localStorage
      // Tại sao? Vì Home page gọi API cần token trong header Authorization.
      // Nếu không lưu ở đây, Home page sẽ bị 401 → redirect về login → vòng lặp.
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      // Sau khi lưu token xong mới navigate
      navigate("/");
    } catch (err) {
      // Lỗi từ getApiErrorMessage đã là tiếng Việt rõ ràng
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================================
  // HANDLER: Đăng ký
  // Gửi { name, email, password } khớp RegisterRequest C#
  // ====================================================================
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiClient.auth.register({ name: username, email, password });

      // ✅ Lưu token sau khi đăng ký
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background preview */}
      <div style={styles.backgroundPreview} aria-hidden="true">
        {previewItems.map((item) => (
          <div key={item.title} style={styles.previewCard}>
            <div style={styles.previewIcon}>♪</div>
            <div>
              <div style={styles.previewTitle}>{item.title}</div>
              <div style={styles.previewDesc}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.logo}>TuneVault</h1>
          <p style={styles.sub}>Đăng nhập hoặc tạo tài khoản để tiếp tục nghe nhạc</p>

          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(tab === "login" ? styles.activeTab : {}) }}
              onClick={() => { setTab("login"); setError(""); }}
            >
              Đăng nhập
            </button>
            <button
              style={{ ...styles.tab, ...(tab === "register" ? styles.activeTab : {}) }}
              onClick={() => { setTab("register"); setError(""); }}
            >
              Đăng ký
            </button>
          </div>

          {/* Form */}
          <form onSubmit={tab === "login" ? handleLogin : handleRegister}>
            <div style={styles.form}>
              {/* ✅ SỬA QUAN TRỌNG: 
                  - Tab LOGIN: hiện input EMAIL (gắn state email)
                  - Tab REGISTER: hiện input TÊN (gắn state username)
                  Trước đây: login hiện "Tên đăng nhập" → gửi nhầm field lên backend
              */}
              {tab === "login" ? (
                // --- LOGIN: chỉ cần Email + Password ---
                <>
                  <input
                    style={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoFocus
                    required
                  />
                  {/* Bọc input password vào container tương đối */}
                  <div style={styles.passwordWrapper}>
                    <input
                      style={{...styles.input, width: "100%", paddingRight: 44 }} // Thêm padding bên phải để chừa khoảng trống cho icon
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
                      required
                    />

                    {/* Nút bấm ẩn/hiện dùng icon SVG */}
                    <button
                      type="button" // Bắt buộc phải là type="button" để tránh trigger submit form ngầm định
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      tabIndex={-1} // Bỏ qua khi người dùng nhấn phím Tab để trải nghiệm mượt mà hơn
                    >
                      {showPassword ? (
                        // Icon Mắt Mở (Show)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      ) : (
                        // Icon Mắt Gạch Chéo (Hide)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                // --- REGISTER: Tên + Email + Password ---
                <>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="Tên đăng ký"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    autoFocus
                    required
                  />
                  <input
                    style={styles.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />

                  {/* Bọc input password vào container tương đối */}
                  <div style={styles.passwordWrapper}>
                    <input
                      style={{ ...styles.input, width: "100%", paddingRight: 44 }}
                      type={showPassword ? "text" : "password"}
                      placeholder="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      onKeyDown={(e) => e.key === "Enter" && handleRegister(e)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      )}
                    </button>
                  </div>

                </>
              )}

              {/* Thông báo lỗi */}
              {error && <div style={styles.error}>{error}</div>}

              {/* Nút submit */}
              <button
                type="submit"
                style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : tab === "login"
                    ? "Đăng nhập"
                    : "Tạo tài khoản"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const previewItems = [
  { title: "Trending Now", desc: "Bản hit đang được nghe nhiều nhất" },
  { title: "Your Library", desc: "Playlist và bài hát yêu thích" },
  { title: "Friends Activity", desc: "Bạn bè đang nghe gì" },
  { title: "Upload", desc: "Tải lên nhạc và video" },
];

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#000",
    overflow: "hidden",
  },
  backgroundPreview: {
    position: "absolute",
    inset: 0,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    padding: 48,
    opacity: 0.72,
  },
  previewCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    borderRadius: 18,
    padding: 24,
    backgroundColor: "rgba(18,18,18,0.88)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  previewIcon: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: "#1DB954", color: "#000",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, fontWeight: 800, flexShrink: 0,
  },
  previewTitle: { color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 4 },
  previewDesc: { color: "#b3b3b3", fontSize: 13 },
  overlay: {
    position: "fixed", top: 0, left: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "100%", height: '100vh', padding: 24,
    backgroundColor: "transparent",
    backdropFilter: "blur(2px)",
  },
  card: {
    backgroundColor: "#ffffff", color: "#121212",
    padding: "44px 36px", borderRadius: 18, width: 420,
    display: "flex", flexDirection: "column",
    boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
  },
  logo: { color: "#1DB954", fontSize: 34, fontWeight: 800, textAlign: "center", margin: "0 0 8px" },
  sub: { color: "#535353", fontSize: 14, textAlign: "center", marginBottom: 24 },
  tabs: { display: "flex", backgroundColor: "#f1f1f2", borderRadius: 10, padding: 4, marginBottom: 22 },
  tab: {
    flex: 1, backgroundColor: "transparent", border: "none", color: "#535353",
    padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700,
  },
  activeTab: { backgroundColor: "#ffffff", color: "#121212", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    backgroundColor: "#f6f6f6", border: "1px solid #e5e5e5", borderRadius: 8,
    padding: "14px 16px", color: "#121212", fontSize: 14, outline: "none",
  },
  error: { color: "#f15e6c", fontSize: 13, textAlign: "center", margin: "2px 0", padding: "8px 10px", borderRadius: 8, backgroundColor: "#fff0f1" },
  mockNote: { color: "#7a5a00", fontSize: 12, textAlign: "center", backgroundColor: "#fff7d6", borderRadius: 8, padding: "8px", margin: "0" },
  btn: {
    backgroundColor: "#1DB954", color: "#000", border: "none", borderRadius: 50,
    padding: 15, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 4,
  },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },

  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#a7a7a7", // Màu xám nhẹ hợp tông với input màu nền sáng của bạn
    outline: "none",
  },

};