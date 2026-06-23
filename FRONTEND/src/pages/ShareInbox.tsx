// src/pages/ShareInbox.tsx
import { useEffect, useState } from "react";
import apiClient, { showApiError } from "../api/apiClient.ts";
import type { SharedItemDto as MediaShare } from "../types/Share.ts";
import { ShareStyle } from "../types/Share.ts";

export default function ShareInbox() {
  const [shared, setShared] = useState<MediaShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // * apiClient currently exposes getReceived() (alias getSharedWithMe).
        // * Backend does not provide "sent" list in client yet, so use same endpoint.
        const data = await apiClient.share.getReceived();
        setShared(data);
      } catch (err) {
        // Nếu backend chia sẻ lỗi, hiển thị thông báo rõ cho user.
        showApiError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab]);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Chia sẻ Media</h1>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(tab === "inbox" ? styles.activeTab : {}),
          }}
          onClick={() => setTab("inbox")}
        >
          📥 Nhận được
        </button>
        <button
          style={{ ...styles.tab, ...(tab === "sent" ? styles.activeTab : {}) }}
          onClick={() => setTab("sent")}
        >
          📤 Đã gửi
        </button>
      </div>

      {/* Nội dung */}
      {loading && <p style={styles.info}>Đang tải...</p>}

      {!loading && shared.length === 0 && (
        <p style={styles.empty}>
          {tab === "inbox"
            ? "Chưa có bài hát nào được chia sẻ với bạn."
            : "Bạn chưa chia sẻ bài hát nào."}
        </p>
      )}

      {!loading && shared.length > 0 && (
        <div style={styles.list}>
          {shared.map((item) => (
            <div key={`${item.idItem}-${item.idSender}`} style={styles.card}>
              <div style={styles.cardIcon}>
                {item.shareStyle === ShareStyle.Media ? "🎵" : "📁"}
              </div>
              <div style={styles.cardInfo}>
                <p style={styles.trackTitle}>{item.title ?? "Bài hát"}</p>
                <p style={styles.trackArtist}></p>
                <p style={styles.meta}>
                  {tab === "inbox"
                    ? `Từ: ${item.idSender.slice(0, 8)}`
                    : `Đã gửi`}
                  {" · "}
                  {new Date(item.shareAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <button style={styles.playBtn}>▶ Phát</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "24px 32px", color: "#fff" },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 24 },
  tabs: { display: "flex", gap: 8, marginBottom: 24 },
  tab: {
    backgroundColor: "transparent",
    color: "#b3b3b3",
    border: "1px solid #383838",
    borderRadius: 20,
    padding: "8px 20px",
    cursor: "pointer",
    fontSize: 14,
  },
  activeTab: {
    backgroundColor: "#282828",
    color: "#fff",
    borderColor: "#535353",
  },
  list: { display: "flex", flexDirection: "column", gap: 8 },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#181818",
    borderRadius: 8,
    padding: "14px 16px",
  },
  cardIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#282828",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    flexShrink: 0,
  },
  cardInfo: { flex: 1 },
  trackTitle: { fontSize: 14, fontWeight: 600, marginBottom: 2 },
  trackArtist: { fontSize: 12, color: "#b3b3b3", marginBottom: 4 },
  meta: { fontSize: 11, color: "#535353" },
  playBtn: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: 20,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  },
  info: { color: "#b3b3b3" },
  empty: { color: "#b3b3b3", fontSize: 14 },
};
