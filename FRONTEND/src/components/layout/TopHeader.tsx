// src/components/layout/TopHeader.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";



// ---- Icons ----
function BackIcon() { return <span aria-hidden="true">&lt;</span>; }
function ForwardIcon() { return <span aria-hidden="true">&gt;</span>; }
function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 15h4v6h6v-6h4l-7-7-7 7z" />
    </svg>
  );
}
function BellIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#fff" : "currentColor"}>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}
function FriendsIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#fff" : "currentColor"}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  );
}
function FavoriteIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#FF6B6B" : "currentColor"}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

// ---- Xử lý Lịch sử tìm kiếm ----
function loadSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem("tunevault:searchHistory");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch { return []; }
}
function saveSearchHistory(history: string[]): void {
  try { localStorage.setItem("tunevault:searchHistory", JSON.stringify(history.slice(0, 10))); } catch {}
}
function addSearchHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const next = [trimmed, ...loadSearchHistory().filter((item) => item !== trimmed)].slice(0, 10);
  saveSearchHistory(next);
}
function removeSearchHistoryItem(query: string): void {
  const next = loadSearchHistory().filter((item) => item !== query);
  saveSearchHistory(next);
}

// ---- Tooltip Component ----
function Tooltip({ label, children }: { label: string; children: React.ReactNode; }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={styles.tooltipBox}>{label}</div>
      )}
    </div>
  );
}

interface Props {
  onBellClick: () => void;
  onFriendsClick: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  bellActive: boolean;
  friendsActive: boolean;
  profileActive: boolean;
  username?: string;
}

export default function TopHeader({
  onBellClick, onFriendsClick, onProfileClick, onLogoClick,
  bellActive, friendsActive, profileActive, username = "T",
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Đổi overlay thành isFocused để quản lý dropdown
  const [searchHistory, setSearchHistory] = useState<string[]>(loadSearchHistory());
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const isFavoritesActive = location.pathname === "/favorites";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      // Click ra ngoài ô search thì đóng dropdown gợi ý
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGoBack = () => window.history.back();
  const handleGoForward = () => window.history.forward();

  const getVisibleSuggestions = () => {
    const keyword = search.trim().toLowerCase();
    const fromHistory = searchHistory.filter((item) => !keyword || item.toLowerCase().includes(keyword));
    const matched = Array.from(new Set([...fromHistory]));
    return matched.slice(0, 8); // Hiển thị gọn 8 gợi ý
  };

  const runSearch = () => {
    const keyword = search.trim();
    if (!keyword) return;
    addSearchHistory(keyword);
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    setIsFocused(false); // Gõ xong enter thì ẩn dropdown
  };

  const selectSuggestion = (value: string) => {
    setSearch(value);
    addSearchHistory(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setIsFocused(false);
  };

  const removeHistoryItem = (value: string) => {
    const next = searchHistory.filter((item) => item !== value);
    setSearchHistory(next);
    removeSearchHistoryItem(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") runSearch();
    if (e.key === "Escape") setIsFocused(false);
  };

  return (
    <div style={styles.header}>
      {/* TRÁI: Logo & Navigation */}
      <div style={styles.leftSection}>
        <img src="/TuneVault_logo.png" alt="TuneVault" style={styles.logoImg} onClick={onLogoClick} title="Trang chủ" />
        <button className="btn-icon" style={styles.iconBtn} onClick={handleGoBack} title="Quay lại"><BackIcon /></button>
        <button className="btn-icon" style={styles.iconBtn} onClick={handleGoForward} title="Đi tiếp"><ForwardIcon /></button>
        <button className="btn-icon" style={styles.iconBtn} onClick={onLogoClick} title="Trang chủ"><HomeIcon /></button>
      </div>

      {/* GIỮA: Ô Tìm kiếm có thể gõ được */}
      <div style={styles.searchSection}>
        {/* Khung bọc searchBar để dropdown định vị theo nó */}
        <div ref={searchContainerRef} style={styles.searchContainer}>
          <div style={styles.searchBar}>
            <button className="btn-icon" style={styles.searchButton} onClick={runSearch} title="Tìm kiếm">
              <SearchIcon />
            </button>
            <input
              style={styles.searchInput}
              placeholder="Bạn muốn phát nội dung gì?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setIsFocused(true)}
            />
          </div>

          {/* DROPDOWN GỢI Ý MỚI (Thay cho Overlay toàn màn hình) */}
          {isFocused && (
            <div style={styles.suggestionsDropdown}>
              {getVisibleSuggestions().map((item) => (
                <div key={item} style={styles.suggestionItem} onMouseDown={() => selectSuggestion(item)}>
                  <span>{item}</span>
                  {searchHistory.includes(item) && (
                    <button
                      style={styles.removeHistoryBtn}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        removeHistoryItem(item);
                      }}
                      title={`Xóa "${item}"`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {getVisibleSuggestions().length === 0 && (
                <div style={styles.emptySuggestion}>Chưa có gợi ý phù hợp.</div>
              )}
            </div>
          )}
        </div>

        <button className="btn-icon" style={styles.uploadBtn} onClick={() => navigate("/upload")} title="Tải lên">
          <UploadIcon />
        </button>
      </div>

      {/* PHẢI: Menu User */}
      <div style={styles.rightSection}>
        <Tooltip label="Danh sách yêu thích">
          <button className="btn-icon" onClick={() => navigate("/favorites")} style={{ color: isFavoritesActive ? "#FF6B6B" : "#b3b3b3", backgroundColor: isFavoritesActive ? "#282828" : "transparent" }}>
            <FavoriteIcon active={isFavoritesActive} />
          </button>
        </Tooltip>
        <Tooltip label="Thông báo">
          <button className="btn-icon" onClick={onBellClick} style={{ color: bellActive ? "#fff" : "#b3b3b3", backgroundColor: bellActive ? "#282828" : "transparent" }}>
            <BellIcon active={bellActive} />
          </button>
        </Tooltip>
        <Tooltip label="Chia sẻ">
          <button className="btn-icon" onClick={() => navigate("/share-inbox")} style={{ color: "#b3b3b3" }}>
            <ShareIcon />
          </button>
        </Tooltip>
        <Tooltip label="Hoạt động bạn bè">
          <button className="btn-icon" onClick={onFriendsClick} style={{ color: friendsActive ? "#fff" : "#b3b3b3", backgroundColor: friendsActive ? "#282828" : "transparent" }}>
            <FriendsIcon active={friendsActive} />
          </button>
        </Tooltip>

        <div ref={menuRef} style={{ position: "relative" }}>
          <Tooltip label="Hồ sơ">
            <button style={{ ...styles.avatarBtn, ...(profileActive ? { boxShadow: "0 0 0 2px #fff" } : {}) }} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              {username.charAt(0).toUpperCase()}
            </button>
          </Tooltip>

          {showProfileMenu && (
            <div style={styles.profileMenu}>
              <button style={styles.menuItem} onClick={() => { onProfileClick(); setShowProfileMenu(false); }}>Hồ sơ</button>
              <div style={styles.menuDivider} />
              <button style={styles.menuItem} onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: "grid", gridTemplateColumns: "minmax(220px, 1fr) minmax(320px, 640px) minmax(220px, 1fr)", alignItems: "center", gap: 16, padding: "8px 16px", backgroundColor: "#000000", height: 64, flexShrink: 0 },
  leftSection: { display: "flex", alignItems: "center", gap: 6, justifySelf: "start" },
  logoImg: { height: 32, width: "auto", cursor: "pointer", borderRadius: 6, objectFit: "contain", marginRight: 12 },
  iconBtn: { width: 34, height: 34, padding: 6, color: '#b3b3b3' },
  
  searchSection: { justifySelf: "center", width: "100%", display: "flex", alignItems: "center", gap: 8, maxWidth: 640 },
  searchContainer: { position: "relative", flex: 1 },
  searchBar: { display: "flex", alignItems: "center", gap: 10, backgroundColor: "#242424", borderRadius: 500, padding: "8px 16px" },
  searchButton: { width: 30, height: 30, padding: 4, flexShrink: 0, color: '#b3b3b3', border: 'none', background: 'transparent', cursor: 'pointer' },
  searchInput: { flex: 1, backgroundColor: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 14 },
  
  // Style cho Dropdown nằm dưới thanh search
  suggestionsDropdown: { position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, backgroundColor: "#242424", borderRadius: 8, overflow: "hidden", zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.6)" },
  suggestionItem: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", color: "#fff", cursor: "pointer", fontSize: 14, borderBottom: "1px solid #1a1a1a" },
  removeHistoryBtn: { background: "transparent", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 18, lineHeight: 1 },
  emptySuggestion: { padding: "12px 16px", color: "#b3b3b3", fontSize: 14 },
  
  uploadBtn: { width: 34, height: 34, padding: 6, color: '#b3b3b3' },
  rightSection: { display: "flex", alignItems: "center", gap: 6, justifySelf: "end" },
  avatarBtn: { width: 32, height: 32, borderRadius: "50%", backgroundColor: "#a060e8", border: "none", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  
  profileMenu: { position: "absolute", top: 42, right: 0, backgroundColor: "#282828", borderRadius: 6, minWidth: 180, padding: 6, zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.6)" },
  menuItem: { width: "100%", textAlign: "left", backgroundColor: "transparent", border: "none", color: "#fff", padding: "10px 12px", fontSize: 14, cursor: "pointer", borderRadius: 4 },
  menuDivider: { height: 1, backgroundColor: "#3a3a3a", margin: "4px 0" },
  tooltipBox: { position: "absolute", top: "110%", left: "50%", transform: "translateX(-50%)", backgroundColor: "#282828", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 8px", borderRadius: 4, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 999, boxShadow: "0 4px 12px rgba(0,0,0,0.5)", marginTop: 4 }
};