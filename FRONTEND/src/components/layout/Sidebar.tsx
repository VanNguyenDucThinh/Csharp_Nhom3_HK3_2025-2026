// src/components/layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

// Danh sách playlist mẫu để hiển thị khi chưa có dữ liệu thật.
const mockPlaylists = [
  { id: 1, name: "Yêu thích", isFavorite: true },
  { id: 2, name: "Chill Vibes" },
  { id: 3, name: "Workout Mix" },
];

// ---- SVG Icons ----
// Icon thư viện chiều rộng, vẽ đúng chuẩn Spotify.
function LibraryIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
    </svg>
  );
}

// Icon nhạc nhỏ bên trái mỗi playlist item.
function MusicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

// Component playlist item có hover effect.
function PlaylistLink({
  id,
  name,
  isFavorite,
  active,
}: {
  id: number;
  name: string;
  isFavorite?: boolean;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  return (
    <Link
      to={`/playlist/${id}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px",
        borderRadius: 6,
        textDecoration: "none",
        backgroundColor: active
          ? "#282828"
          : pressed
            ? "#333"
            : hovered
              ? "#1a1a1a"
              : "transparent",
        transform: pressed ? "scale(0.98)" : "scale(1)",
        transition: "background-color 0.15s, transform 0.1s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 4,
          backgroundColor: hovered ? "#383838" : "#282828",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: isFavorite ? "#1DB954" : "#b3b3b3",
          transition: "background-color 0.15s",
        }}
      >
        {isFavorite ? <span>💚</span> : <MusicIcon />}
      </div>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            marginBottom: 2,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 11, color: "#b3b3b3" }}>Playlist</div>
      </div>
    </Link>
  );
}

// Tooltip component - hiển thị text khi hover vào icon.
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

// Component playlist item mini cho trạng thái thu gọn.
function MiniPlaylistButton({ id, name }: { id: number; name: string }) {
  // Khi thu gọn, chỉ hiện icon nhỏ, tooltip hiện tên playlist.
  return (
    <Tooltip label={name}>
      <Link to={`/playlist/${id}`} style={{ textDecoration: "none" }}>
        <button className="btn-icon" style={{ padding: 8 }} title={name}>
          <MusicIcon />
        </button>
      </Link>
    </Tooltip>
  );
}

export default function Sidebar({
  collapsed,
  onToggle,
  onCollapse,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  onCollapse?: () => void;
}) {
  const location = useLocation();
  const [playlists] = useState(mockPlaylists);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const [showCollapseBtn, setShowCollapseBtn] = useState(false);

  // Mặc định collapsed = false nếu không truyền prop (để tương thích ngược).
  const isCollapsed = collapsed ?? false;

  // Lấy đường dẫn hiện tại để xác định active state cho playlist.
  const isActivePlaylist = (id: number) =>
    location.pathname === `/playlist/${id}`;
  const isLibraryActive = location.pathname === "/library";
  const isFavoritesActive = location.pathname === "/favorites";

  return (
    <div style={styles.container}>
      <div style={styles.libraryBox}>
        {isCollapsed ? (
          // === TRẠNG THÁI THU GỌN ===
          // Chỉ hiện icon thư viện, nút mở rộng xuất hiện khi hover đúng vào icon.
          <div
            style={styles.collapsedContent}
            onMouseEnter={() => setShowExpandBtn(true)}
            onMouseLeave={() => setShowExpandBtn(false)}
          >
            <Tooltip label="Mở Thư Viện của bạn">
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <button
                  className="btn-icon"
                  onClick={onToggle}
                  style={{ padding: 10, margin: "8px 0" }}
                  title="Mở rộng thư viện"
                >
                  <LibraryIcon />
                </button>
                <button
                  style={{
                    ...styles.expandBtn,
                    ...(showExpandBtn ? styles.expandBtnVisible : {}),
                  }}
                  className="btn-icon"
                  onClick={onToggle}
                  title="Mở rộng thư viện"
                >
                  ▶
                </button>
              </div>
            </Tooltip>
            <div style={{ marginTop: 2 }}>
              <Tooltip label="Những bài hát yêu thích của bạn">
                <Link to="/playlist/1" style={{ textDecoration: "none" }}>
                  <span
                    style={{ fontSize: 18, margin: "2px 0", cursor: "pointer" }}
                  >
                    💚
                  </span>
                </Link>
              </Tooltip>
            </div>
            <div style={styles.collapsedPlaylistList}>
              {playlists.map((pl) =>
                pl.id === 1 ? null : (
                  <MiniPlaylistButton key={pl.id} id={pl.id} name={pl.name} />
                ),
              )}
            </div>
          </div>
        ) : (
          // === TRẠNG THÁI MỞ RỘNG ===
          // Nút thu gọn nằm đè lên nút Thư viện, chỉ hiện khi hover đúng vùng Thư viện.
          <>
            <div style={styles.libraryHeader}>
              <div
                style={styles.libraryTitleMask}
                onMouseEnter={() => setShowCollapseBtn(true)}
                onMouseLeave={() => setShowCollapseBtn(false)}
              >
                <Link
                  to="/library"
                  style={{
                    ...styles.libraryTitleLink,
                    ...(isLibraryActive ? styles.libraryTitleActive : {}),
                  }}
                >
                  <LibraryIcon />
                  <span>Thư viện của bạn</span>
                </Link>
                <button
                  style={{
                    ...styles.collapseMaskButton,
                    ...(showCollapseBtn
                      ? styles.collapseMaskButtonVisible
                      : {}),
                  }}
                  className="btn-icon"
                  onClick={onCollapse || onToggle}
                  title="Thu gọn thư viện"
                >
                  ◀
                </button>
              </div>
            </div>

            {/* Link Danh sách yêu thích */}
            <Link
              to="/favorites"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px",
                borderRadius: 6,
                textDecoration: "none",
                backgroundColor: isFavoritesActive ? "#282828" : "transparent",
                transition: "background-color 0.15s, color 0.15s",
                color: isFavoritesActive ? "#ffffff" : "#b3b3b3",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: isFavoritesActive ? "#383838" : "#282828",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "#1DB954",
                  transition: "background-color 0.15s",
                }}
              >
                ❤️
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "inherit",
                    marginBottom: 2,
                  }}
                >
                  Danh sách yêu thích
                </div>
                <div style={{ fontSize: 11, color: "#b3b3b3" }}>
                  Các bài hát đã thích
                </div>
              </div>
            </Link>

            <div style={styles.playlistList}>
              {playlists.map((pl) => (
                <PlaylistLink
                  key={pl.id}
                  id={pl.id}
                  name={pl.name}
                  isFavorite={pl.isFavorite}
                  active={isActivePlaylist(pl.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#121212",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  libraryBox: {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  libraryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 4,
  },
  libraryTitleMask: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  libraryTitleLink: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 14,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 700,
    padding: "10px 8px",
    borderRadius: 6,
    color: "#b3b3b3",
    backgroundColor: "transparent",
    transition: "color 0.15s, background-color 0.15s",
  },
  libraryTitleActive: {
    color: "#ffffff",
    backgroundColor: "#282828",
  },
  collapsedContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
  },
  playlistList: { flex: 1, overflowY: "auto", padding: "4px 0" },
  collapsedPlaylistList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
    flex: 1,
    overflowY: "auto",
  },
  expandBtn: {
    position: "absolute",
    top: 2,
    right: -10,
    backgroundColor: "#1a1a1a",
    padding: 2,
    borderRadius: "50%",
    fontSize: 10,
    color: "#b3b3b3",
    border: "none",
    cursor: "pointer",
    opacity: 0,
    transition: "opacity 0.15s",
  },
  expandBtnVisible: {
    opacity: 1,
  },
  collapseMaskButton: {
    position: "absolute",
    top: "50%",
    right: 8,
    transform: "translateY(-50%)",
    width: 28,
    height: 28,
    padding: 4,
    backgroundColor: "transparent",
    color: "#b3b3b3",
    opacity: 0,
    pointerEvents: "none",
    zIndex: 5,
    transition: "opacity 0.15s, background-color 0.15s, transform 0.15s",
  },
  collapseMaskButtonVisible: {
    opacity: 1,
    pointerEvents: "auto",
    backgroundColor: "#282828",
  },
};
