// src/components/layout/TopHeader.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const searchSuggestions = [
  "Nhạc trẻ Việt Nam",
  "V-Pop Hot 2026",
  "Chill Lo-fi",
  "Workout Mix",
  "Sơn Tùng M-TP",
  "Đen Vâu",
  "Hà Anh Tuấn",
  "Hoàng Thùy Linh",
  "Ballad buồn",
  "Rap Việt mới",
  "EDM Party",
  "Acoustic Guitar",
  "Nhạc không lời",
  "Karaoké tình yêu",
  "Top Hits Quốc Tế",
  "K-pop Dance",
  "US-UK Chart",
  "Nhạc phim hay",
  "Video clip mới",
  "Playlist học tập",
];

const popularSearches = [
  { title: "V-Pop Hot 2026", description: "Nhạc trẻ được nghe nhiều nhất" },
  { title: "Chill Lo-fi", description: "Học tập và làm việc" },
  { title: "Workout Mix", description: "Năng lượng cho phòng gym" },
  { title: "Top Hits Quốc Tế", description: "Xu hướng toàn cầu" },
  { title: "Rap Việt mới", description: "Bản rap đang thịnh hành" },
  { title: "Ballad buồn", description: "Tâm trạng và cảm xúc" },
  { title: "EDM Party", description: "Nhịp đập cho buổi tiệc" },
  { title: "Acoustic Guitar", description: "Giai điệu mộc mạc" },
];

// ---- Icons ----
function BackIcon() {
  // Dấu "<" đúng yêu cầu: icon Go Back ngắn gọn, Tooltip giữ nội dung đầy đủ.
  return <span aria-hidden="true">&lt;</span>;
}
function ForwardIcon() {
  // Dấu ">" đúng yêu cầu: icon Go Forward ngắn gọn, Tooltip giữ nội dung đầy đủ.
  return <span aria-hidden="true">&gt;</span>;
}
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
  // Mũi tên hướng lên để đúng nghĩa của nút "Tải lên" trên header.
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 15h4v6h6v-6h4l-7-7-7 7z" />
    </svg>
  );
}
function BellIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={active ? "#fff" : "currentColor"}
    >
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  );
}
function FriendsIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={active ? "#fff" : "currentColor"}
    >
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
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={active ? "#FF6B6B" : "currentColor"}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function loadSearchHistory(): string[] {
  try {
    // Đọc lịch sử tìm kiếm từ localStorage để hiển thị lại khi người dùng mở overlay.
    const raw = localStorage.getItem("tunevault:searchHistory");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : [];
  } catch {
    // Nếu localStorage lỗi, trả về mảng rỗng để giao diện không bị crash.
    return [];
  }
}

function saveSearchHistory(history: string[]): void {
  try {
    // Lưu tối đa 20 mục lịch sử để overlay không bị quá dài.
    localStorage.setItem(
      "tunevault:searchHistory",
      JSON.stringify(history.slice(0, 20)),
    );
  } catch {
    // Nếu không lưu được lịch sử, vẫn cho phép người dùng tìm kiếm bình thường.
  }
}

function addSearchHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed) return;
  const next = [
    trimmed,
    ...loadSearchHistory().filter((item) => item !== trimmed),
  ].slice(0, 20);
  saveSearchHistory(next);
}

function removeSearchHistoryItem(query: string): void {
  const next = loadSearchHistory().filter((item) => item !== query);
  saveSearchHistory(next);
}

// Tooltip component nhỏ gọn.
function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#282828",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            marginTop: 4,
          }}
        >
          {label}
        </div>
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
  onBellClick,
  onFriendsClick,
  onProfileClick,
  onLogoClick,
  bellActive,
  friendsActive,
  profileActive,
  username = "T",
}: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchHistory, setSearchHistory] =
    useState<string[]>(loadSearchHistory());
  const menuRef = useRef<HTMLDivElement>(null);
  const searchFrameRef = useRef<HTMLDivElement>(null);
  const isFavoritesActive = location.pathname === "/favorites";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // Đóng menu profile khi click ra ngoài avatar.
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      // Click ra ngoài khung tìm kiếm sẽ thoát chế độ tìm kiếm overlay.
      if (
        isSearchOverlayOpen &&
        searchFrameRef.current &&
        !searchFrameRef.current.contains(e.target as Node)
      ) {
        setIsSearchOverlayOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOverlayOpen]);

  const handleGoBack = () => {
    // Nút Go Back dùng lịch sử trình duyệt để quay lại trang trước.
    window.history.back();
  };

  const handleGoForward = () => {
    // Nút Go Forward dùng lịch sử trình duyệt để tiến tới trang sau.
    window.history.forward();
  };

  const getVisibleSuggestions = () => {
    const keyword = search.trim().toLowerCase();
    const fromHistory = searchHistory.filter(
      (item) => !keyword || item.toLowerCase().includes(keyword),
    );
    const fromSuggestions = searchSuggestions.filter(
      (item) => !keyword || item.toLowerCase().includes(keyword),
    );
    const matched = Array.from(new Set([...fromHistory, ...fromSuggestions]));
    // Nếu ít hơn 20 mục, bổ sung gợi ý phổ biến để overlay luôn dễ chọn.
    return Array.from(new Set([...matched, ...searchSuggestions])).slice(0, 20);
  };

  const openSearchOverlay = () => {
    // Khi click/focus vào thanh tìm kiếm, mở overlay giống trải nghiệm tìm kiếm Nike.
    setIsSearchOverlayOpen(true);
  };

  const runSearch = () => {
    const keyword = search.trim();
    if (!keyword) return;
    // Lưu từ khóa vào lịch sử trước khi chuyển sang trang kết quả tìm kiếm.
    addSearchHistory(keyword);
    navigate(`/search?q=${encodeURIComponent(keyword)}`);
    setIsSearchOverlayOpen(false);
  };

  const selectSuggestion = (value: string) => {
    setSearch(value);
    // Chọn gợi ý cũng được xem như một lượt tìm kiếm có lịch sử.
    addSearchHistory(value);
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setIsSearchOverlayOpen(false);
  };

  const removeHistoryItem = (value: string) => {
    const next = searchHistory.filter((item) => item !== value);
    // Cập nhật state trước rồi mới lưu lại localStorage để UI và dữ liệu luôn đồng bộ.
    setSearchHistory(next);
    removeSearchHistoryItem(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      runSearch();
    }
    if (e.key === "Escape") {
      setIsSearchOverlayOpen(false);
    }
  };

  return (
    <div style={styles.header}>
      {/* Trái: Logo, Go Back, Go Forward và Home */}
      <div style={styles.leftSection}>
        <img
          src="/TuneVault_logo.png"
          alt="TuneVault"
          style={styles.logoImg}
          onClick={onLogoClick}
          title="Trang chủ"
        />

        <button
          className="btn-icon"
          style={styles.historyBtn}
          onClick={handleGoBack}
          title="Quay lại"
        >
          <BackIcon />
        </button>

        <button
          className="btn-icon"
          style={styles.historyBtn}
          onClick={handleGoForward}
          title="Đi tiếp"
        >
          <ForwardIcon />
        </button>

        <button
          className="btn-icon"
          style={styles.homeBtn}
          onClick={onLogoClick}
          title="Trang chủ"
        >
          <HomeIcon />
        </button>
      </div>

      {/* Giữa: Search bar + nút Tải lên, luôn nằm chính giữa TopHeader */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <button
            className="btn-icon"
            style={styles.searchButton}
            onClick={() => {
              openSearchOverlay();
              runSearch();
            }}
            title="Tìm kiếm"
          >
            <SearchIcon />
          </button>
          <input
            style={styles.searchInput}
            placeholder="Bạn muốn phát nội dung gì?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            onFocus={openSearchOverlay}
            onClick={openSearchOverlay}
          />
        </div>

        <button
          className="btn-icon"
          style={styles.uploadBtn}
          onClick={() => navigate("/upload")}
          title="Tải lên"
        >
          <UploadIcon />
        </button>
      </div>

      {/* Phải: Favorites, Bell, Share, Friends, Avatar (Profile) */}
      <div style={styles.rightSection}>
        <Tooltip label="Danh sách yêu thích">
          <button
            className="btn-icon"
            onClick={() => navigate("/favorites")}
            style={{
              color: isFavoritesActive ? "#FF6B6B" : "#b3b3b3",
              backgroundColor: isFavoritesActive ? "#282828" : "transparent",
            }}
          >
            <FavoriteIcon active={isFavoritesActive} />
          </button>
        </Tooltip>

        <Tooltip label="Thông báo">
          <button
            className="btn-icon"
            onClick={onBellClick}
            style={{
              color: bellActive ? "#fff" : "#b3b3b3",
              backgroundColor: bellActive ? "#282828" : "transparent",
            }}
          >
            <BellIcon active={bellActive} />
          </button>
        </Tooltip>

        <Tooltip label="Chia sẻ">
          <button
            className="btn-icon"
            onClick={() => navigate("/share-inbox")}
            style={{ color: "#b3b3b3" }}
          >
            <ShareIcon />
          </button>
        </Tooltip>

        <Tooltip label="Hoạt động bạn bè">
          <button
            className="btn-icon"
            onClick={onFriendsClick}
            style={{
              color: friendsActive ? "#fff" : "#b3b3b3",
              backgroundColor: friendsActive ? "#282828" : "transparent",
            }}
          >
            <FriendsIcon active={friendsActive} />
          </button>
        </Tooltip>

        <div ref={menuRef} style={{ position: "relative" }}>
          <Tooltip label="Hồ sơ">
            <button
              style={{
                ...styles.avatarBtn,
                ...(profileActive ? { boxShadow: "0 0 0 2px #fff" } : {}),
              }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              {username.charAt(0).toUpperCase()}
            </button>
          </Tooltip>

          {showProfileMenu && (
            <div style={styles.dropdown}>
              <button
                style={styles.dropdownItem}
                onClick={() => {
                  onProfileClick();
                  setShowProfileMenu(false);
                }}
              >
                Hồ sơ
              </button>
              <div style={styles.dropdownDivider} />
              <button
                style={styles.dropdownItem}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {isSearchOverlayOpen && (
        <div
          style={styles.searchOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsSearchOverlayOpen(false);
          }}
        >
          <div style={styles.searchOverlayTop}>
            <div
              ref={searchFrameRef}
              style={styles.searchOverlayFrame}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                className="btn-icon"
                style={styles.cancelSearchBtn}
                onClick={() => setIsSearchOverlayOpen(false)}
              >
                Hủy
              </button>

              <div style={styles.searchBar}>
                <button
                  className="btn-icon"
                  style={styles.searchButton}
                  onClick={runSearch}
                  title="Tìm kiếm"
                >
                  <SearchIcon />
                </button>
                <input
                  style={styles.searchInput}
                  placeholder="Bạn muốn phát nội dung gì?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={openSearchOverlay}
                  onClick={openSearchOverlay}
                />
              </div>

              <div style={styles.suggestionsBox}>
                {getVisibleSuggestions().map((item) => (
                  <button
                    key={item}
                    style={styles.suggestionItem}
                    onClick={() => selectSuggestion(item)}
                  >
                    <span>{item}</span>
                    {searchHistory.includes(item) && (
                      <button
                        style={styles.removeHistoryBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHistoryItem(item);
                        }}
                        title={`Xóa "${item}"`}
                      >
                        ×
                      </button>
                    )}
                  </button>
                ))}
                {getVisibleSuggestions().length === 0 && (
                  <div style={styles.emptySuggestion}>
                    Chưa có gợi ý phù hợp.
                  </div>
                )}
              </div>

              <div style={styles.popularTitle}>Thịnh Hành</div>
              <div style={styles.popularGrid}>
                {popularSearches.map((item) => (
                  <button
                    key={item.title}
                    className="popular-search-card"
                    style={styles.popularCard}
                    onClick={() => selectSuggestion(item.title)}
                  >
                    <span style={styles.popularCardTitle}>{item.title}</span>
                    <span style={styles.popularCardDesc}>
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.searchOverlayBottom} />
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 1fr) minmax(320px, 640px) minmax(220px, 1fr)",
    alignItems: "center",
    gap: 16,
    padding: "8px 16px",
    backgroundColor: "#000000",
    height: 64,
    flexShrink: 0,
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
    justifySelf: "end",
  },
  // Logo thu nhỏ để vừa với header, hiển thị đầy đủ logo mà không che khuất nút.
  logoImg: {
    height: 32,
    width: "auto",
    cursor: "pointer",
    flexShrink: 0,
    borderRadius: 6,
    objectFit: "contain",
  },

  historyBtn: { width: 34, height: 34, padding: 6 },
  homeBtn: { width: 34, height: 34, padding: 6 },

  searchSection: {
    justifySelf: "center",
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 8,
    maxWidth: 640,
  },

  searchBar: {
    position: "relative",
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 500,
    padding: "6px 16px",
  },
  searchButton: { width: 30, height: 30, padding: 4, flexShrink: 0 },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: 14,
  },
  // --- Giữ lại cụm gợi ý trong overlay tìm kiếm ---
  suggestionsBox: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 6,
    zIndex: 80,
    boxShadow: "0 12px 30px rgba(0,0,0,0.7)",
    maxHeight: 320,
    overflowY: "auto",
  },
  suggestionItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    textAlign: "left",
    fontSize: 13,
  },
  removeHistoryBtn: {
    width: 22,
    height: 22,
    borderRadius: "50%",
    border: "none",
    backgroundColor: "transparent",
    color: "#b3b3b3",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
  },
  emptySuggestion: { color: "#b3b3b3", fontSize: 13, padding: "8px 10px" },
  // --------------------------------------------------
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    justifySelf: "start",
  },

  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#a060e8",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    position: "absolute",
    top: 42,
    right: 0,
    backgroundColor: "#282828",
    borderRadius: 6,
    minWidth: 180,
    padding: 6,
    zIndex: 50,
    boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
  },
  dropdownItem: {
    width: "100%",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    padding: "10px 12px",
    fontSize: 14,
    cursor: "pointer",
    borderRadius: 4,
  },
  dropdownDivider: { height: 1, backgroundColor: "#3a3a3a", margin: "4px 0" },

  searchOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgba(0,0,0,0.42)",
    backdropFilter: "blur(10px)",
  },
  searchOverlayTop: {
    minHeight: "52vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "96px 24px 40px",
    backgroundColor: "rgba(0,0,0,0.88)",
  },
  searchOverlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.26)",
    backdropFilter: "blur(14px)",
  },
  searchOverlayFrame: {
    width: "min(720px, 100%)",
    backgroundColor: "rgba(26,26,26,0.96)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 24px 80px rgba(0,0,0,0.72)",
  },
  cancelSearchBtn: {
    marginLeft: "auto",
    display: "flex",
    marginBottom: 14,
    fontSize: 13,
    fontWeight: 700,
  },
  popularTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 800,
    marginTop: 28,
    marginBottom: 14,
  },
  popularGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 12,
  },
  popularCard: {
    minHeight: 116,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#242424",
    color: "#fff",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 6,
  },
  popularCardTitle: { fontSize: 14, fontWeight: 800 },
  popularCardDesc: { fontSize: 12, color: "#b3b3b3" },
};
