// src/components/layout/RightPanel.tsx
import React, { useState, useEffect } from "react";
import { usePlayer } from "../../pages/PlayerContext.tsx";
import apiClient, { showApiError } from "../../api/apiClient.ts";

const BACKEND_DOMAIN = "http://localhost:5124";

// ================= CÁC ICON =================
function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );
}

// ================= COMPONENT MODAL CHIA SẺ =================
function ShareModal({ track, onClose }: { track: any; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchUser = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length === 0) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API thực tế từ Backend
      const result = await apiClient.share.searchUser(val);
      setUsers(result || []);
    } catch (error) {
      console.error("Lỗi tìm kiếm người dùng", error);
      showApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareToUser = async (userId: string, username: string) => {
    try {
      // Gọi API chia sẻ bài hát
      // ShareStyle.Media = 0 (dựa trên enum của bạn)
      await apiClient.share.send(userId, track.id, 0);

      alert(`Đã chia sẻ "${track.title}" thành công cho ${username}!`);
      onClose();
    } catch (error) {
      showApiError(error);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={{ margin: 0, fontSize: 18, color: "#fff" }}>
            Chia sẻ bài hát
          </h3>
          <button style={styles.closeModalBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={query}
          onChange={handleSearchUser}
          style={styles.searchInput}
          autoFocus
        />

        <div style={styles.userList}>
          {isLoading && (
            <div
              style={{ color: "#b3b3b3", textAlign: "center", fontSize: 14 }}
            >
              Đang tìm kiếm...
            </div>
          )}
          {!isLoading && users.length === 0 && query.trim() !== "" && (
            <div
              style={{ color: "#b3b3b3", textAlign: "center", fontSize: 14 }}
            >
              Không tìm thấy người dùng.
            </div>
          )}

          {!isLoading &&
            users.map((user) => (
              <div key={user.id} style={styles.userRow}>
                <div style={styles.userInfo}>
                  <img
                    src={user.avatarUrl? `${BACKEND_DOMAIN}/${user.avatarUrl}`: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    style={styles.userAvatarImage}
                  />
                  <div style={styles.userName}>{user.name}</div>
                </div>
                <button
                  style={styles.sendBtn}
                  onClick={() => handleShareToUser(user.id, user.name)}
                >
                  Gửi
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENT RIGHT PANEL =================
export default function RightPanel({ onClose }: { onClose: () => void }) {
  const { currentTrack, favIds, toggleFavId, mediaRef } = usePlayer();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (currentTrack) {
      setIsFavorite(favIds.has(currentTrack.id));
    }
  }, [currentTrack, favIds]);

  const handleToggleFavorite = async () => {
    if (!currentTrack) return;
    const trackId = currentTrack.id;
    const previousState = isFavorite;
    setIsFavorite(!previousState);
    try {
      previousState
        ? await apiClient.media.unfavorite(trackId)
        : await apiClient.media.favorite(trackId);
      toggleFavId(trackId);
    } catch (error) {
      setIsFavorite(previousState);
      showApiError(error);
    }
  };

  if (!currentTrack) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.activeTab}>Đang phát</button>
          <button style={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div
          style={{
            ...styles.body,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b3b3b3",
          }}
        >
          Chưa có bài hát đang phát
        </div>
      </div>
    );
  }
  const buildImageUrl = (url?: string) => {
    if (!url) return "";
    const normalizedUrl = url.replace(/\\/g, "/");
    return normalizedUrl.startsWith("http")? normalizedUrl : `${BACKEND_DOMAIN}/${normalizedUrl}`;
  };

  const coverSrc = buildImageUrl(currentTrack.urlImage);
  const mediaSrc = buildImageUrl(currentTrack.urlMedia);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.activeTab}>Đang phát</button>
          <button style={styles.closeBtn} onClick={onClose} title="Thu gọn">
            <CloseIcon />
          </button>
        </div>

        <div style={styles.body}>
          {currentTrack.mediaStyle === 1 ? (
            <video
              ref={(el) => {
                mediaRef.current = el;
              }}
              controls
              src={mediaSrc}
              style={styles.imageCover}
            />
          ) : (
            <>
              <audio
                ref={(el) => {
                  mediaRef.current = el;
                }}
                src={mediaSrc}
                style={{ display: "none" }}
              />
              {currentTrack.urlImage ? (
                <img
                  src={coverSrc}
                  alt={currentTrack.title}
                  style={styles.imageCover}
                />
              ) : (
                <div
                  style={{
                    ...styles.bigCover,
                    background: "linear-gradient(135deg, #1e3264, #121212)",
                  }}
                >
                  <span style={styles.bigCoverIcon}>🎵</span>
                </div>
              )}
            </>
          )}

          <div style={styles.trackInfo}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
              <div style={styles.trackTitle}>{currentTrack.title}</div>
              <div style={styles.trackArtist}>{currentTrack.artist}</div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                style={styles.iconBtn}
                onClick={() => setIsShareModalOpen(true)}
                title="Chia sẻ"
              >
                <ShareIcon />
              </button>
              <button
                style={{
                  ...styles.iconBtn,
                  color: isFavorite ? "#1DB954" : "#b3b3b3",
                }}
                onClick={handleToggleFavorite}
                title="Yêu thích"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "#1DB954" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
          <div style={styles.divider} />
          <div style={styles.sectionTitle}>Nghệ sĩ</div>
          <div style={styles.artistBox}>
            <div style={styles.artistAvatar}>🎤</div>
            <div style={styles.artistName}>{currentTrack.artist}</div>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <ShareModal
          track={currentTrack}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </>
  );
}

// ================= STYLES GIAO DIỆN =================
const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: "#121212",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderLeft: "1px solid #282828",
    width: "300px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "14px 12px",
    borderBottom: "1px solid #282828",
  },
  activeTab: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
  },
  closeBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  body: { overflowY: "auto", padding: "16px" },
  imageCover: {
    width: "100%",
    aspectRatio: "1",
    borderRadius: 8,
    objectFit: "cover",
    marginBottom: 16,
  },
  bigCover: {
    width: "100%",
    aspectRatio: "1",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  bigCoverIcon: { fontSize: 64 },
  trackInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  trackArtist: {
    fontSize: 14,
    color: "#b3b3b3",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#b3b3b3",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  divider: { height: 1, backgroundColor: "#282828", margin: "20px 0" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 12,
  },
  artistBox: { display: "flex", alignItems: "center", gap: 10 },
  artistAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    backgroundColor: "#282828",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  artistName: { fontSize: 14, fontWeight: 700, color: "#fff" },

  // Styles bổ sung cho Modal Chia sẻ
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#282828",
    width: "400px",
    maxWidth: "90%",
    borderRadius: "8px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeModalBtn: {
    background: "transparent",
    border: "none",
    color: "#b3b3b3",
    cursor: "pointer",
    padding: 4,
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "4px",
    border: "1px solid transparent",
    backgroundColor: "#3e3e3e",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxHeight: "300px",
    overflowY: "auto",
  },
  userRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #3e3e3e",
  },
  userInfo: { display: "flex", alignItems: "center", gap: "12px" },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: "#535353",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  userName: { color: "#fff", fontSize: "14px", fontWeight: 600 },
  sendBtn: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
