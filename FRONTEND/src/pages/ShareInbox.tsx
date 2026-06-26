import { useEffect, useState } from "react";
import apiClient, { showApiError } from "../api/apiClient.ts";
import type { SharedItemDto as MediaShare } from "../types/Share.ts";
import { ShareStyle } from "../types/Share.ts";
import { usePlayer } from "../pages/PlayerContext.tsx";

export default function ShareInbox() {
  const [shared, setShared] = useState<MediaShare[]>([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.share.getReceived();
        setShared(data);
      } catch (err) {
        showApiError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Logic phát nhạc: Lấy thông tin chi tiết qua ID rồi mới phát
  const handlePlay = async (item: MediaShare) => {
    try {
      let mediaData;
      // Gọi đúng endpoint dựa vào style
      if (item.shareStyle === ShareStyle.Video) {
        mediaData = await apiClient.media.getVideo(item.idItem);
      } else {
        mediaData = await apiClient.media.getById(item.idItem);
      }

      // Phát nhạc thông qua Context
      playTrack({
        id: mediaData.id,
        title: mediaData.title,
        artist: mediaData.artist || "Unknown",
        urlMedia: mediaData.urlMedia,
        urlImage: mediaData.urlImage,
        mediaStyle: item.shareStyle === ShareStyle.Video ? 1 : 0
      });
    } catch (err) {
      showApiError("Không thể phát media này: " + err);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Chia sẻ Media</h1>

      {loading && <p style={styles.info}>Đang tải...</p>}

      {!loading && shared.length === 0 && (
        <p style={styles.empty}>Chưa có bài hát nào được chia sẻ với bạn.</p>
      )}

      {!loading && shared.length > 0 && (
        <div style={styles.list}>
          {shared.map((item) => (
            <div key={`${item.idItem}-${item.idSender}`} style={styles.card}>
              <div style={styles.cardIcon}>
                {item.shareStyle === ShareStyle.Video ? "🎬" : "🎵"}
              </div>
              <div style={styles.cardInfo}>
                <p style={styles.trackTitle}>{item.title ?? "Bài hát"}</p>
                <p style={styles.meta}>
                  Từ: {item.idSender.slice(0, 8)} • {new Date(item.shareAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <button style={styles.playBtn} onClick={() => handlePlay(item)}>
                ▶ Phát
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "24px 32px", color: "#fff", backgroundColor: "#121212", minHeight: "100vh" },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 24 },
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
  trackTitle: { fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#fff" },
  meta: { fontSize: 11, color: "#b3b3b3", margin: 0 },
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