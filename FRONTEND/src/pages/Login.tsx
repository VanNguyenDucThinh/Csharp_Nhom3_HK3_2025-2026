// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient.ts";

const previewItems = [
  { title: "Trending Now", desc: "Bản hit đang được nghe nhiều nhất" },
  { title: "Your Library", desc: "Playlist và bài hát yêu thích" },
  { title: "Friends Activity", desc: "Bạn bè đang nghe gì" },
  { title: "Upload", desc: "Tải lên nhạc và video" },
];

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");

  // ── FIX LỖI 1: Tách biến rõ ràng cho từng tab ──────────────
  // Trước đây chỉ có 1 biến "email" dùng chung cho cả 2 tab,
  // nên input "Email đăng nhập" và input "Email" đăng ký đều
  // cùng bind vào 1 biến → cả 2 cùng hiện, cùng đổi giá trị.
  //
  // Giải pháp: mỗi tab có biến riêng, render đúng input đúng tab.
  // Tab Login chỉ cần: loginEmail + loginPassword
  // Tab Register cần: registerName + registerEmail + registerPassword
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName]         = useState("");
  const [registerEmail, setRegisterEmail]       = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // ── Chuyển tab → xóa lỗi cũ, KHÔNG reset giá trị form ────
  // Người dùng có thể chuyển qua lại để so sánh — không nên xóa dữ liệu họ đang nhập
  const handleChuyenTab = (tabMoi: "login" | "register") => {
    setTab(tabMoi);
    setError("");
  };

  // ── Xử lý Đăng nhập ────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // apiClient.auth.login trả về AuthResponseDto { id, name, email, token }
      const ketQua = await apiClient.auth.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      // ── FIX LỖI 2: Lưu token vào localStorage SAU KHI nhận được ──
      // Đây là nguyên nhân chính khiến bạn bị kẹt ở trang Login!
      //
      // Luồng lỗi cũ:
      //   1. Login API thành công → trả về { token: "eyJ..." }
      //   2. KHÔNG lưu token → localStorage['token'] vẫn rỗng
      //   3. navigate('/') → vào Home
      //   4. Home gọi API playlist/history → axiosInstance đọc token rỗng
      //   5. Backend trả 401 Unauthorized
      //   6. axiosInstance interceptor thấy 401 → tự navigate('/login')
      //   7. Bạn thấy "reload về login" dù đã nhập đúng!
      //
      // Luồng đúng bây giờ:
      //   1. Login API thành công → trả về { token: "eyJ..." }
      //   2. Lưu token vào localStorage NGAY LẬP TỨC
      //   3. navigate('/') → axiosInstance đọc được token → mọi API sau đều OK
      localStorage.setItem("token", ketQua.token);
      localStorage.setItem("user", JSON.stringify(ketQua));

      navigate("/");

    } catch (err) {
      // err.message đã là tiếng Việt từ getApiErrorMessage() trong apiClient
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Xử lý Đăng ký ──────────────────────────────────────────
  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (registerPassword.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const ketQua = await apiClient.auth.register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });

      // Tương tự login: phải lưu token ngay sau khi đăng ký thành công
      localStorage.setItem("token", ketQua.token);
      localStorage.setItem("user", JSON.stringify(ketQua));

      navigate("/");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đăng ký thất bại. Email có thể đã tồn tại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
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

      <div style={styles.overlay}>
        <div style={styles.card}>
          <h1 style={styles.logo}>TuneVault</h1>
          <p style={styles.sub}>
            Đăng nhập hoặc tạo tài khoản để tiếp tục nghe nhạc
          </p>

          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(tab === "login" ? styles.activeTab : {}) }}
              onClick={() => handleChuyenTab("login")}
            >
              Đăng nhập
            </button>
            <button
              style={{ ...styles.tab, ...(tab === "register" ? styles.activeTab : {}) }}
              onClick={() => handleChuyenTab("register")}
            >
              Đăng ký
            </button>
          </div>

          {/* ── FIX LỖI 1: Render HOÀN TOÀN TÁCH BIỆT 2 form ─────
              Không dùng if/else lồng trong 1 form chung nữa.
              Mỗi tab có form riêng, input riêng, biến riêng.
              Không bao giờ bị "lẫn" input của tab này sang tab kia. */}
          <div style={styles.form}>
            {tab === "login" ? (
              // ── FORM ĐĂNG NHẬP ──────────────────────────────────
              <>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email đăng nhập"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  disabled={loading}
                />
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Mật khẩu"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </>
            ) : (
              // ── FORM ĐĂNG KÝ ────────────────────────────────────
              <>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="Tên của bạn"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  disabled={loading}
                />
                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  disabled={loading}
                />
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Mật khẩu (ít nhất 8 ký tự)"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </>
            )}

            {error && <div style={styles.error}>⚠️ {error}</div>}

            <button
              style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
              onClick={tab === "login" ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : tab === "login"
                  ? "Đăng nhập"
                  : "Tạo tài khoản"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles giữ nguyên hoàn toàn như bản gốc của bạn
const styles: Record<string, React.CSSProperties> = {
  page: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#000", overflow: "hidden" },
  backgroundPreview: { position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, padding: 48, opacity: 0.72 },
  previewCard: { display: "flex", alignItems: "center", gap: 16, borderRadius: 18, padding: 24, backgroundColor: "rgba(18,18,18,0.88)", border: "1px solid rgba(255,255,255,0.08)" },
  previewIcon: { width: 56, height: 56, borderRadius: 14, backgroundColor: "#1DB954", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, flexShrink: 0 },
  previewTitle: { color: "#fff", fontSize: 18, fontWeight: 800, marginBottom: 4 },
  previewDesc: { color: "#b3b3b3", fontSize: 13 },
  overlay: { position: "fixed", top: 0, left: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", width: "100vw", height: "100vh", padding: 24, backgroundColor: "transparent", backdropFilter: "blur(2px)" },
  card: { backgroundColor: "#ffffff", color: "#121212", padding: "44px 36px", borderRadius: 18, width: 420, display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.45)" },
  logo: { color: "#1DB954", fontSize: 34, fontWeight: 800, textAlign: "center", margin: "0 0 8px" },
  sub: { color: "#535353", fontSize: 14, textAlign: "center", marginBottom: 24 },
  tabs: { display: "flex", backgroundColor: "#f1f1f2", borderRadius: 10, padding: 4, marginBottom: 22 },
  tab: { flex: 1, backgroundColor: "transparent", border: "none", color: "#535353", padding: "10px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700 },
  activeTab: { backgroundColor: "#ffffff", color: "#121212", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { backgroundColor: "#f6f6f6", border: "1px solid #e5e5e5", borderRadius: 8, padding: "14px 16px", color: "#121212", fontSize: 14, outline: "none" },
  error: { color: "#f15e6c", fontSize: 13, textAlign: "center", margin: "2px 0", padding: "8px 10px", borderRadius: 8, backgroundColor: "#fff0f1" },
  btn: { backgroundColor: "#1DB954", color: "#000", border: "none", borderRadius: 50, padding: 15, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 4 },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
};