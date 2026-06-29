// src/pages/Search.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient, { showApiError } from "../api/apiClient.ts";
import type { MediaDto as MediaItem } from "../types/Media.ts";
import { Category } from "../types/Media.ts";
import { usePlayer } from "./PlayerContext.tsx";

const BACKEND_DOMAIN = "http://localhost:5124";

// HÀM CHUẨN HÓA URL (Chuyển \ thành / và nối domain)
function buildImageUrl(url?: string): string {
  if (!url) return "";
  const normalizedUrl = url.replace(/\\/g, "/");
  return normalizedUrl.startsWith("http")
    ? normalizedUrl
    : `${BACKEND_DOMAIN}/${normalizedUrl}`;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTrendingMode, setIsTrendingMode] = useState(false);

  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const { playTrack } = usePlayer();

  useEffect(() => {
    const loadFavIds = async () => {
      try {
        const favList = await apiClient.media.getFavorites();
        setFavIds(new Set(favList.map((item: any) => item.id)));
      } catch (err) {
        console.error("Lỗi tải danh sách yêu thích:", err);
      }
    };
    loadFavIds();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await apiClient.media.search(q, 1, 10);
        const searchData =
          (response as any).data?.listMedia ||
          (response as any).listMedia ||
          [];
        setResults(searchData);
      } catch (err) {
        showApiError(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [q]);

  const handlePlay = async (track: MediaItem) => {
    try {
      let mediaData;
      if (track.mediaStyle === 1) {
        mediaData = await apiClient.media.getVideo(track.id);
      } else {
        mediaData = await apiClient.media.getById(track.id);
      }

      const finalData =
        (mediaData as any).data?.data || (mediaData as any).data || mediaData;

      playTrack({
        id: finalData.id || track.id,
        title: finalData.title || track.title,
        artist: finalData.artist || track.artist,
        urlMedia: finalData.urlMedia,
        urlImage: finalData.urlImage || track.urlImage,
        mediaStyle: track.mediaStyle,
      });
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết bài hát:", err);
      alert("Không thể phát bài này. Vui lòng thử lại!");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.featureBar}>
        <button
          style={{
            ...styles.featureBtn,
            backgroundColor: "#fff",
            color: "#000",
          }}
        >
          Tất cả
        </button>
        <button
          style={{
            ...styles.featureBtn,
            backgroundColor: "#282828",
            color: "#fff",
          }}
        >
          Bài hát
        </button>
        <button
          style={{
            ...styles.featureBtn,
            backgroundColor: "#282828",
            color: "#fff",
          }}
        >
          Playlist
        </button>
      </div>

      <div style={styles.divider} />

      <div>
        <h2 style={styles.sectionTitle}>
          {isTrendingMode ? "Đang thịnh hành" : `Kết quả tìm kiếm cho "${q}"`}
        </h2>

        {loading ? (
          <p style={styles.info}>Đang tìm kiếm...</p>
        ) : results.length === 0 ? (
          <p style={styles.info}>Không tìm thấy kết quả nào cho "{q}"</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHead}>
                <th style={{ ...styles.th, width: 48 }}>#</th>
                <th style={styles.th}>Tiêu đề</th>
                <th style={styles.th}>Nghệ sĩ</th>
                <th style={styles.th}>Thể loại</th>
                <th style={{ ...styles.th, width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr
                  key={item.id}
                  style={styles.row}
                  onClick={() => handlePlay(item)}
                >
                  <td style={{ ...styles.td, color: "#b3b3b3" }}>
                    {index + 1}
                  </td>
                  <td style={styles.td}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {/* ĐÃ BỌC HÀM buildImageUrl VÀO ĐÂY */}
                      {item.urlImage ? (
                        <img
                          src={buildImageUrl(item.urlImage)}
                          alt="cover"
                          style={styles.trackCover}
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          } // Nếu ảnh lỗi thì ẩn đi
                        />
                      ) : (
                        <span style={styles.typeIcon}>🎵</span>
                      )}
                      <span style={{ fontWeight: 600 }}>{item.title}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: "#b3b3b3" }}>
                    {item.artist}
                  </td>
                  <td style={{ ...styles.td, color: "#b3b3b3" }}>
                    {Category[item.category]}
                  </td>
                  <td style={styles.td}>{favIds.has(item.id) ? "❤️" : "🤍"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "24px 32px", color: "#fff" },
  featureBar: { display: "flex", gap: 12, marginBottom: 20 },
  featureBtn: {
    padding: "8px 16px",
    borderRadius: 20,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  },
  divider: { height: 1, backgroundColor: "#282828", marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  info: { color: "#b3b3b3", marginTop: 16 },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHead: { borderBottom: "1px solid #282828" },
  th: {
    padding: "8px 12px",
    textAlign: "left",
    color: "#b3b3b3",
    fontSize: 12,
    fontWeight: 500,
  },
  row: {
    borderBottom: "1px solid #1a1a1a",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  td: { padding: "10px 12px", fontSize: 14 },
  trackCover: { width: 40, height: 40, borderRadius: 4, objectFit: "cover" },
  typeIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#282828",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
};
