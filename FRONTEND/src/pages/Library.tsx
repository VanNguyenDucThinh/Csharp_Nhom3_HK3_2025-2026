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
  
  // States cho Form tạo mới
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName]       = useState("");
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState("");
  
  // THÊM MỚI: State để điều khiển việc hiện popup hỏi Public/Private
  const [showPublicConfirm, setShowPublicConfirm] = useState(false);
  const [hoveredPlaylistId, setHoveredPlaylistId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const taoTenKhongTrung = (tenGoc: string, danhSachHienTai: Playlist[]): string => {
    const tenDaTon = new Set(danhSachHienTai.map((pl) => pl.name?.trim().toLowerCase()));
    if (!tenDaTon.has(tenGoc.trim().toLowerCase())) {
      return tenGoc.trim();
    }
    let soThuTu = 1;
    while (tenDaTon.has(`${tenGoc.trim().toLowerCase()} (${soThuTu})`)) {
      soThuTu++;
    }
    return `${tenGoc.trim()} (${soThuTu})`;
  };


  const handleBamTao = () => {
    if (!newName.trim()) {
      setCreateError("Vui lòng nhập tên playlist.");
      return;
    }
    setCreateError("");
    // Mở popup thay vì gọi API ngay lập tức
    setShowPublicConfirm(true); 
  };


  const thucHienTaoPlaylist = async (isPublicStatus: string) => {
    setCreating(true);
    setCreateError("");

    try {
      const tenCuoiCung = taoTenKhongTrung(newName, playlists);
      const formData = new FormData();

      formData.append("Name", tenCuoiCung);
      // Truyền đúng trạng thái user vừa chọn vào FormData
      formData.append("IsPublic", isPublicStatus);

      const pl = await apiClient.playlist.create(formData);

      setPlaylists((prev) => [pl, ...prev]);
      
      // Reset toàn bộ UI về trạng thái ban đầu sau khi thành công
      setNewName("");
      setShowCreate(false);
      setShowPublicConfirm(false); 

    } catch (err) {
      if (err instanceof Error) {
        setCreateError(err.message);
      } else {
        setCreateError("Tạo playlist thất bại. Vui lòng thử lại.");
      }
      // Tắt popup để user thấy lỗi hiện ở form nhập tên
      setShowPublicConfirm(false);
    } finally {
      setCreating(false);
    }
  };

  
  const handleXoaPlaylist = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();

    if (!window.confirm(`Bạn có chắc chắn muốn xóa playlist "${name}" không?`)) {
      return;
    }

    setDeletingId(id);
    try {
      // 1. Gọi API xóa
      await apiClient.playlist.delete(id);
      
      // 2. CẬP NHẬT STATE TRỰC TIẾP (QUAN TRỌNG)
      // Lọc bỏ playlist vừa xóa khỏi mảng state hiện tại để React tự cập nhật UI
      setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
      
      // 3. Thông báo thành công (nếu cần)
      console.log("Xóa playlist thành công!");
    } catch (err) {
      // Nếu API vẫn trả lỗi (do cấu trúc phản hồi), ta kiểm tra playlist còn tồn tại không
      // Nếu nó đã mất trong danh sách nghĩa là xóa thành công
      console.error("Lỗi xóa playlist:", err);
      // Chỉ hiện thông báo nếu playlist vẫn còn nằm trong danh sách
      alert("Đã xảy ra lỗi khi xóa, vui lòng kiểm tra lại.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleHuyTao = () => {
    setShowCreate(false);
    setNewName("");
    setCreateError("");
    setShowPublicConfirm(false);
  };

  if (loading)
    return <div style={{ padding: 40, color: "#b3b3b3" }}>Đang tải...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Thư viện</h1>
        <button style={styles.addBtn} onClick={() => { setShowCreate(!showCreate); setCreateError(""); }}>
          + Tạo playlist
        </button>
      </div>

      {showCreate && (
        <div style={styles.createForm}>
          <input
            style={{ ...styles.input, ...(createError ? styles.inputError : {}) }}
            placeholder="Nhập tên playlist..."
            value={newName}
            autoFocus
            onChange={(e) => { setNewName(e.target.value); setCreateError(""); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBamTao(); // Đổi thành handleBamTao
              if (e.key === "Escape") handleHuyTao();
            }}
            disabled={creating}
          />
          <button
            style={{ ...styles.confirmBtn, ...(creating ? { opacity: 0.6 } : {}) }}
            onClick={handleBamTao} // Đổi thành handleBamTao
            disabled={creating}
          >
            {creating ? "Đang xử lý..." : "Tạo"}
          </button>
          <button style={styles.cancelBtn} onClick={handleHuyTao} disabled={creating}>
            Hủy
          </button>
          {createError && <span style={styles.errorText}> {createError}</span>}
        </div>
      )}

      {/* ── SECTION: Playlist của tôi ────────────────────────── */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Playlist của tôi ({playlists.length})</h2>

        {playlists.length === 0 ? (
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
                style={{
                  ...styles.item,
                  // Tự động đổi màu nền nếu đang hover VÀO đúng playlist này
                  backgroundColor: hoveredPlaylistId === pl.id ? "#1a1a1a" : "transparent"
                }}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                // Bắt sự kiện chuột ra/vào để set ID đang được hover
                onMouseEnter={() => setHoveredPlaylistId(pl.id)}
                onMouseLeave={() => setHoveredPlaylistId(null)}
              >
                {/* KHỐI BÊN TRÁI: Icon và Text */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={styles.itemIcon}>♪</div> 
                  <div>
                    <div style={styles.itemName}>{pl.name}</div>
                    <div style={styles.itemSub}>
                      Playlist {pl.isPublic === "Public" ? "Công khai" : "Riêng tư"} • {pl.track?.length ?? 0} bài
                    </div>
                  </div>
                </div>

                {/* KHỐI BÊN PHẢI: Nút Xóa (chỉ hiện khi đang hover đúng dòng này) */}
                {(hoveredPlaylistId === pl.id || deletingId === pl.id) && (
                  <button
                    style={{
                      ...styles.deleteBtn,
                      ...(deletingId === pl.id ? { opacity: 0.5, cursor: "not-allowed" } : {})
                    }}
                    onClick={(e) => handleXoaPlaylist(e, pl.id, pl.name || "Không tên")}
                    disabled={deletingId === pl.id}
                    title="Xóa playlist này"
                  >
                    {deletingId === pl.id ? "..." : "✕"}
                  </button>
                )}
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
                <div style={styles.itemIcon}>♪</div>
                {/* Bọc nội dung vào 1 div có flex: 1 để nó chiếm hết khoảng trống bên trái */}
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div style={styles.itemName}>{item.title}</div>
                  <div style={styles.itemSub}>{item.artist}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* POPUP XÁC NHẬN CÔNG KHAI / RIÊNG TƯ                            */}
      {/* ============================================================ */}
      {showPublicConfirm && (
        <div style={styles.overlay} onClick={() => !creating && setShowPublicConfirm(false)}>
          <div style={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Bạn có muốn playlist của bạn công khai?</h3>
            <p style={styles.confirmSub}>Người khác có thể tìm thấy và xem playlist này.</p>
            
            <div style={styles.confirmBtns}>
              {/* Tại sao dùng onMouseEnter/onMouseLeave? 
                  Vì inline-style của React không hỗ trợ CSS :hover. 
                  Ta can thiệp trực tiếp vào DOM node để đổi màu khi chuột ra/vào. */}
              <button 
                style={styles.btnPopupBase} 
                onClick={() => thucHienTaoPlaylist("1")}
                disabled={creating}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1DB954"; // Đổi nền xanh
                  e.currentTarget.style.color = "#000";              // Đổi chữ đen
                  e.currentTarget.style.borderColor = "#1DB954";     // Giấu viền xám
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"; // Trả về trong suốt
                  e.currentTarget.style.color = "#fff";                  // Trả về chữ trắng
                  e.currentTarget.style.borderColor = "#535353";         // Trả về viền xám
                }}
              >
                {creating ? "..." : "Có (Công khai)"}
              </button>
              
              <button 
                style={styles.btnPopupBase} 
                onClick={() => thucHienTaoPlaylist("0")}
                disabled={creating}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1DB954";
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.borderColor = "#1DB954";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.borderColor = "#535353";
                }}
              >
                {creating ? "..." : "Không (Riêng tư)"}
              </button>
            </div>
          </div>
        </div>
      )}

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
  item:         { display: "flex", alignItems: "center", width: "100%", gap: 15, justifyContent: "space-between", padding: "10px 12px", borderRadius: 6, cursor: "pointer", transition: "background-color 0.2s ease" },  
  itemIcon:     { fontSize: 22, width: 44, height: 44, backgroundColor: "#282828", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#b3b3b3" },
  itemName:     { color: "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"},
  itemSub:      { fontSize: 12, color: "#b3b3b3", marginTop: 2 },
  emptyBox:     { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 },
  emptyText:    { color: "#b3b3b3", fontSize: 14 },
  emptyBtn:     { backgroundColor: "transparent", color: "#fff", border: "1px solid #535353", borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 },
  
  // Styles mới cho Popup
  overlay:      { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  confirmBox:   { backgroundColor: "#282828", borderRadius: 8, padding: 24, width: 400, maxWidth: "90%", display: "flex", flexDirection: "column", gap: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" },
  confirmTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" },
  confirmSub:   { margin: "0 0 16px 0", fontSize: 14, color: "#b3b3b3" },
  confirmBtns:  { display: "flex", gap: 12, justifyContent: "flex-end" },
  
  // Gộp chung 1 style gốc (Base) cho cả 2 nút, để code không bị lặp lại
  btnPopupBase: { 
    backgroundColor: "transparent", 
    color: "#fff", 
    border: "1px solid #535353", 
    borderRadius: 20, 
    padding: "8px 20px", 
    fontWeight: 700, 
    cursor: "pointer", 
    fontSize: 14,
    transition: "all 0.2s ease" // TẠI SAO CẦN DÒNG NÀY? Để khi hover, màu sắc chuyển đổi mượt mà chứ không bị giật (chớp) đổi màu ngay lập tức.
  },
  deleteBtn:    { backgroundColor: "transparent", border: "none", color: "#b3b3b3", fontSize: 16, cursor: "pointer", padding: "4px 8px", fontWeight: "bold" },
};