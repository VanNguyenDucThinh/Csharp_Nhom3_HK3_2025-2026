// src/pages/Library.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { showApiError } from "../api/apiClient.ts";
import type { MediaDto as MediaItem } from "../types/Media.ts";
import type { PlayListDto as Playlist } from "../types/Playlist.ts";

export default function Library() {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [uploads, setUploads]     = useState<MediaItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]       = useState("");
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [pls, trendData] = await Promise.all([
          apiClient.playlist.getAll(),
          apiClient.media.trend(1, 50),
        ]);
        setPlaylists(pls);
        const mediaList: MediaItem[] = trendData.listTrending || [];
        setUploads(mediaList);
      } catch (err) {
        showApiError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Hàm tạo tên playlist không trùng ──────────────────────────
  // Nếu "HelloWorld" đã tồn tại → thử "HelloWorld (1)", "HelloWorld (2)"...
  // cho đến khi tìm được tên chưa dùng.
  // Tại sao check ở Frontend? Vì backend không tự thêm số — nếu gửi tên trùng
  // backend sẽ tạo 2 playlist cùng tên (hoặc báo lỗi tùy implementation).
  // Check phía Frontend giúp UX mượt hơn, không cần round-trip thêm.
  const taoTenKhongTrung = (tenGoc: string, danhSachHienTai: Playlist[]): string => {
    const tenDaTon = new Set(danhSachHienTai.map((pl) => pl.name?.trim().toLowerCase()));

    // Nếu tên gốc chưa có → dùng thẳng
    if (!tenDaTon.has(tenGoc.trim().toLowerCase())) {
      return tenGoc.trim();
    }

    // Tên đã tồn tại → thêm số tăng dần cho đến khi tìm được tên mới
    let soThuTu = 1;
    while (tenDaTon.has(`${tenGoc.trim().toLowerCase()} (${soThuTu})`)) {
      soThuTu++;
    }
    return `${tenGoc.trim()} (${soThuTu})`;
  };

  const handleCreatePlaylist = async () => {
    if (!newName.trim()) {
      setCreateError("Vui lòng nhập tên playlist.");
      return;
    }
    setCreating(true);
    setCreateError("");

    try {
      // Tính tên cuối cùng (có thể thêm số nếu trùng)
      const tenCuoiCung = taoTenKhongTrung(newName, playlists);

      const formData = new FormData();

      // ── FIX LỖI CHÍNH: Gửi "Name" (chữ hoa) thay vì "name" ───
      // Backend C# dùng [FromForm] với property "Name" (Pascal case).
      // FormData key phân biệt hoa thường — "name" ≠ "Name".
      // Nếu gửi "name", model binding của ASP.NET không tìm thấy
      // field nào khớp với property "Name" → [Required] fail → lỗi 400
      // → frontend hiện "Đã xảy ra lỗi không xác định".
      formData.append("Name", tenCuoiCung);

      // IsPublic: 0 = Private, 1 = Public (theo PlayListStatus enum trong backend)
      // Mặc định tạo playlist Private, user có thể đổi sau trong trang detail.
      formData.append("IsPublic", "0");

      const pl = await apiClient.playlist.create(formData);

      // Thêm playlist mới vào đầu danh sách (mới nhất lên trên)
      setPlaylists((prev) => [pl, ...prev]);
      setNewName("");
      setShowCreate(false);

    } catch (err) {
      // Hiện lỗi ngay trong form thay vì alert popup
      if (err instanceof Error) {
        setCreateError(err.message);
      } else {
        setCreateError("Tạo playlist thất bại. Vui lòng thử lại.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleHuyTao = () => {
    setShowCreate(false);
    setNewName("");
    setCreateError("");
  };

  if (loading)
    return <div style={{ padding: 40, color: "#b3b3b3" }}>Đang tải...</div>;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Thư viện</h1>
        <button style={styles.addBtn} onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}>
          + Tạo playlist
        </button>
      </div>

      {/* Form tạo playlist — hiện khi bấm nút hoặc "Tạo playlist đầu tiên" */}
      {showCreate && (
        <div style={styles.createForm}>
          <input
            style={{ ...styles.input, ...(createError ? styles.inputError : {}) }}
            placeholder="Nhập tên playlist..."
            value={newName}
            autoFocus
            onChange={(e) => { setNewName(e.target.value); setCreateError(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreatePlaylist();
              if (e.key === "Escape") handleHuyTao();
            }}
            disabled={creating}
          />
          <button
            style={{ ...styles.confirmBtn, ...(creating ? { opacity: 0.6 } : {}) }}
            onClick={handleCreatePlaylist}
            disabled={creating}
          >
            {creating ? "Đang tạo..." : "Tạo"}
          </button>
          <button style={styles.cancelBtn} onClick={handleHuyTao}>
            Hủy
          </button>
          {/* Thông báo lỗi inline ngay dưới form — không dùng alert popup */}
          {createError && <span style={styles.errorText}> {createError}</span>}
        </div>
      )}

      {/* ── SECTION: Playlist của tôi ────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Playlist của tôi ({playlists.length})</h2>

        {playlists.length === 0 ? (
          // Chỉ hiện "Chưa có playlist" khi mảng rỗng THẬT SỰ
          // Sau khi tạo xong, playlists.length > 0 → đoạn này tự ẩn
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>Chưa có playlist nào.</p>
            <button
              style={styles.emptyBtn}
              onClick={() => { setShowCreate(true); setCreateError(""); }}
            >
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
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div style={styles.itemIcon}>🎵</div>
                <div>
                  <div style={styles.itemName}>{pl.name}</div>
                  <div style={styles.itemSub}>
                    Playlist • {pl.track?.length ?? 0} bài
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION: Bài tôi đã tải lên ─────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Bài tôi đã tải lên ({uploads.length})</h2>
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
  page:         { padding: "24px 32px", color: "#fff" },
  header:       { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  title:        { fontSize: 28, fontWeight: 700 },
  addBtn:       { backgroundColor: "#1DB954", color: "#000", border: "none", borderRadius: 20, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  createForm:   { display: "flex", gap: 10, marginBottom: 24, alignItems: "center", flexWrap: "wrap", backgroundColor: "#1a1a1a", padding: "16px", borderRadius: 8 },
  input:        { backgroundColor: "#2a2a2a", border: "1px solid #535353", borderRadius: 6, padding: "10px 16px", color: "#fff", fontSize: 14, outline: "none", width: 300 },
  inputError:   { borderColor: "#f78482" },
  errorText:    { color: "#f78482", fontSize: 13, width: "100%", marginTop: 4 },
  confirmBtn:   { backgroundColor: "#1DB954", color: "#000", border: "none", borderRadius: 6, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 },
  cancelBtn:    { backgroundColor: "transparent", color: "#b3b3b3", border: "1px solid #535353", borderRadius: 6, padding: "10px 18px", cursor: "pointer", fontSize: 14 },
  section:      { marginBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  list:         { display: "flex", flexDirection: "column", gap: 2 },
  item:         { display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 6, cursor: "pointer", backgroundColor: "transparent" },
  itemIcon:     { fontSize: 22, width: 44, height: 44, backgroundColor: "#282828", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  itemName:     { fontSize: 14, fontWeight: 600 },
  itemSub:      { fontSize: 12, color: "#b3b3b3", marginTop: 2 },
  emptyBox:     { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 },
  emptyText:    { color: "#b3b3b3", fontSize: 14 },
  emptyBtn:     { backgroundColor: "transparent", color: "#fff", border: "1px solid #535353", borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 },
};