// src/pages/Library.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { showApiError } from "../api/apiClient.ts";
import type { MediaDto as MediaItem } from "../types/Media.ts";
import type { PlayListDto as Playlist } from "../types/Playlist.ts";

// Mock data để test khi chưa có backend
const USE_MOCK = false;

export default function Library() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [uploads, setUploads] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (USE_MOCK) {
        // Dữ liệu mẫu để test giao diện
        setPlaylists([]);
        setUploads([]);
        setLoading(false);
        return;
      }
      try {
        const [pls, trendData] = await Promise.all([
          apiClient.playlist.getAll(),
          apiClient.media.trend(1, 50), // Lấy 50 media trending
        ]);
        setPlaylists(pls);
        // trend() trả về SearchTrendingDto, dùng field 'trending'
        const mediaList: MediaItem[] = trendData.listTrending || [];
        setUploads(mediaList);
      } catch (err) {
        // Nếu backend thư viện lỗi, vẫn giữ giao diện và thông báo lỗi cho user.
        showApiError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      if (USE_MOCK) {
        // Tạo playlist giả để test
        const mockPlaylist: Playlist = {
          id: String(Date.now()),
          name: newName.trim(),
          owner: "1",
          track: [],
        };
        setPlaylists((prev) => [mockPlaylist, ...prev]);
      } else {
        const formData = new FormData();
        formData.append("name", newName.trim());
        const pl = await apiClient.playlist.create(formData);
        setPlaylists((prev) => [pl, ...prev]);
      }
      setNewName("");
      setShowCreate(false);
    } catch (err) {
      // Nếu tạo playlist thất bại, thông báo rõ thay vì để app dừng đột ngột.
      showApiError(err);
    } finally {
      setCreating(false);
    }
  };

  if (loading)
    return <div style={{ padding: 40, color: "#b3b3b3" }}>Đang tải...</div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Thư viện</h1>
        <button
          style={styles.addBtn}
          onClick={() => setShowCreate(!showCreate)}
        >
          + Tạo playlist
        </button>
      </div>

      {/* Form tạo playlist */}
      {showCreate && (
        <div style={styles.createForm}>
          <input
            style={styles.input}
            placeholder="Nhập tên playlist..."
            value={newName}
            autoFocus
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreatePlaylist();
              if (e.key === "Escape") setShowCreate(false);
            }}
          />
          <button
            style={{
              ...styles.confirmBtn,
              ...(creating ? { opacity: 0.6 } : {}),
            }}
            onClick={handleCreatePlaylist}
            disabled={creating}
          >
            {creating ? "Đang tạo..." : "Tạo"}
          </button>
          <button
            style={styles.cancelBtn}
            onClick={() => {
              setShowCreate(false);
              setNewName("");
            }}
          >
            Hủy
          </button>
        </div>
      )}

      {/* Playlist của tôi */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Playlist của tôi ({playlists.length})
        </h2>
        {playlists.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>Chưa có playlist nào.</p>
            <button style={styles.emptyBtn} onClick={() => setShowCreate(true)}>
              Tạo playlist đầu tiên
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {playlists.map((pl) => (
              <div
                key={pl.id}
                style={styles.item}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1a1a1a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <div style={styles.itemIcon}>🎵</div>
                <div>
                  <div style={styles.itemName}>{pl.name}</div>
                  <div style={styles.itemSub}>{pl.track?.length ?? 0} bài</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bài hát đã tải lên */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Bài tôi đã tải lên ({uploads.length})
        </h2>
        {uploads.length === 0 ? (
          <p style={styles.emptyText}>Chưa có file nào được tải lên.</p>
        ) : (
          <div style={styles.list}>
            {uploads.map((item) => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemIcon}>🎵</div>
                <div>
                  <div style={styles.itemName}>{item.title}</div>
                  <div style={styles.itemSub}>{item.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "24px 32px", color: "#fff" },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: 28, fontWeight: 700 },
  addBtn: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: 20,
    padding: "8px 20px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
  createForm: {
    display: "flex",
    gap: 10,
    marginBottom: 24,
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: "16px",
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #535353",
    borderRadius: 6,
    padding: "10px 16px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    width: 300,
  },
  confirmBtn: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: 6,
    padding: "10px 20px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
  cancelBtn: {
    backgroundColor: "transparent",
    color: "#b3b3b3",
    border: "1px solid #535353",
    borderRadius: 6,
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: 14,
  },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  list: { display: "flex", flexDirection: "column", gap: 2 },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "10px 12px",
    borderRadius: 6,
    cursor: "pointer",
    backgroundColor: "transparent",
  },
  itemIcon: {
    fontSize: 22,
    width: 44,
    height: 44,
    backgroundColor: "#282828",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  itemName: { fontSize: 14, fontWeight: 600 },
  itemSub: { fontSize: 12, color: "#b3b3b3", marginTop: 2 },
  emptyBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  },
  emptyText: { color: "#b3b3b3", fontSize: 14 },
  emptyBtn: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #535353",
    borderRadius: 20,
    padding: "8px 20px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
  },
};
