// src/pages/PlaylistDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../api/apiClient.ts";
import { usePlayer } from "./PlayerContext.tsx";
import type { PlayListDto as Playlist } from "../types/Playlist.ts";
import type { MediaDto } from "../types/Media.ts";
import { Category } from "../types/Media.ts";

const BACKEND_DOMAIN = "http://localhost:5124";

// ============================================================
// HELPER: Xây dựng URL đầy đủ cho ảnh từ backend
// ============================================================
function buildImageUrl(url?: string): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${BACKEND_DOMAIN}/${url}`;
}

// ============================================================
// SUB-COMPONENT: Modal chọn bài hát từ thư viện để thêm vào playlist
//
// Hiển thị danh sách tất cả media đang trending (= tất cả bài đã upload),
// cho phép người dùng chọn 1 bài để thêm vào playlist hiện tại.
// ============================================================
function ModalChonBaiHat({
  playlistId,
  danhSachDaThem, // Danh sách id bài đã có trong playlist → không cho thêm trùng
  onClose,
  onThemThanhCong,
}: {
  playlistId: string;
  danhSachDaThem: string[];
  onClose: () => void;
  onThemThanhCong: (track: MediaDto) => void;
}) {
  const [danhSachMedia, setDanhSachMedia] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [dangThem, setDangThem] = useState<string | null>(null); // id bài đang xử lý
  const [error, setError] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  // Tải danh sách tất cả media khi modal mở
  useEffect(() => {
    const load = async () => {
      try {
        const ketQua = await apiClient.media.trend(1, 100);
        setDanhSachMedia(ketQua.listTrending ?? []);
      } catch {
        setError("Không tải được danh sách bài hát.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Lọc theo từ khóa tìm kiếm (phía client, không gọi API thêm)
  const danhSachHienThi = danhSachMedia.filter((m) => {
    const tuKhoaThap = tuKhoa.toLowerCase();
    return (
      m.title.toLowerCase().includes(tuKhoaThap) ||
      m.artist.toLowerCase().includes(tuKhoaThap)
    );
  });

  const handleThem = async (track: MediaDto) => {
    setDangThem(track.id);
    setError("");
    try {
      // POST /api/playlist/{playlistId}/tracks — body: { mediaId }
      await apiClient.playlist.addTrack(playlistId, track.id);
      // Thông báo cho component cha cập nhật danh sách ngay không cần reload
      onThemThanhCong(track);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Thêm bài hát thất bại. Vui lòng thử lại.");
      }
    } finally {
      setDangThem(null);
    }
  };

  return (
    // Click ra ngoài modal → đóng
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.box} onClick={(e) => e.stopPropagation()}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>Thêm bài hát vào playlist</h2>
          <button style={modalStyles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Ô tìm kiếm lọc danh sách ngay trên client */}
        <input
          style={modalStyles.searchInput}
          placeholder="🔍 Tìm theo tên bài hoặc nghệ sĩ..."
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          autoFocus
        />

        {error && <p style={modalStyles.errorText}>⚠️ {error}</p>}

        <div style={modalStyles.list}>
          {loading ? (
            <p style={modalStyles.emptyText}>Đang tải...</p>
          ) : danhSachHienThi.length === 0 ? (
            <p style={modalStyles.emptyText}>
              {tuKhoa
                ? "Không tìm thấy bài hát phù hợp."
                : "Chưa có bài hát nào."}
            </p>
          ) : (
            danhSachHienThi.map((track) => {
              const daTonTai = danhSachDaThem.includes(track.id);
              const dangXuLy = dangThem === track.id;

              return (
                <div key={track.id} style={modalStyles.item}>
                  {/* Ảnh bìa bài hát */}
                  <div style={modalStyles.itemCover}>
                    {track.urlImage ? (
                      <img
                        src={buildImageUrl(track.urlImage)}
                        alt={track.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 20 }}>🎵</span>
                    )}
                  </div>

                  {/* Tên và nghệ sĩ */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={modalStyles.itemTitle}>{track.title}</div>
                    <div style={modalStyles.itemSub}>{track.artist}</div>
                  </div>

                  {/* Nút thêm — disabled nếu đã có trong playlist */}
                  <button
                    style={{
                      ...modalStyles.addBtn,
                      ...(daTonTai ? modalStyles.addBtnDisabled : {}),
                    }}
                    onClick={() => !daTonTai && !dangXuLy && handleThem(track)}
                    disabled={daTonTai || dangXuLy}
                  >
                    {dangXuLy ? "..." : daTonTai ? "✓ Đã có" : "+ Thêm"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT CHÍNH: PlaylistDetail
// Hiển thị chi tiết playlist + các chức năng:
//   1. Xem danh sách bài hát trong playlist
//   2. Phát bài hát khi click
//   3. Thêm bài hát từ thư viện (modal)
//   4. Xóa bài hát khỏi playlist
// ============================================================
export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const { playTrack } = usePlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hienModal, setHienModal] = useState(false);
  const [dangXoa, setDangXoa] = useState<string | null>(null); // id bài đang xóa
  const [thongBao, setThongBao] = useState(""); // Thông báo thành công tạm thời
  const [rowHover, setRowHover] = useState<string | null>(null);

  const loadPlaylist = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.playlist.getById(id);
      setPlaylist(data);
    } catch (err) {
      // Hiện lỗi inline thay vì alert popup
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Không tải được playlist. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  // Ẩn thông báo thành công sau 3 giây
  useEffect(() => {
    if (!thongBao) return;
    const timer = setTimeout(() => setThongBao(""), 3000);
    return () => clearTimeout(timer);
  }, [thongBao]);

  // ── Callback khi thêm bài thành công từ Modal ─────────────
  // Cập nhật state trực tiếp thay vì gọi lại API
  const handleThemThanhCong = (track: MediaDto) => {
    setPlaylist((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        track: [...(prev.track ?? []), track],
      };
    });
    setThongBao(`Đã thêm "${track.title}" vào playlist!`);
  };

  // ── Xóa bài hát khỏi playlist ────────────────────────────
  const handleXoaBai = async (trackId: string, trackTitle: string) => {
    if (!id) return;
    if (!window.confirm(`Xóa "${trackTitle}" khỏi playlist?`)) return;

    setDangXoa(trackId);
    try {
      await apiClient.playlist.removeTrack(id, trackId);
      // Cập nhật state trực tiếp, không gọi lại API
      setPlaylist((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          track: prev.track.filter((t) => t.id !== trackId),
        };
      });
      setThongBao(`Đã xóa "${trackTitle}" khỏi playlist.`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Xóa bài hát thất bại. Vui lòng thử lại.");
      }
    } finally {
      setDangXoa(null);
    }
  };

  // ── Phát bài hát khi click vào hàng ──────────────────────
  const handlePhatBai = (track: MediaDto) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      urlMedia: track.urlMedia,
      urlImage: track.urlImage,
    });
  };

  // ── TRẠNG THÁI: ĐANG TẢI ─────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: 40, color: "#b3b3b3", fontSize: 15 }}>
        Đang tải playlist...
      </div>
    );
  }

  // ── TRẠNG THÁI: LỖI ──────────────────────────────────────
  if (error && !playlist) {
    return (
      <div style={{ padding: 40 }}>
        <p style={{ color: "#f78482", marginBottom: 16 }}>{error}</p>
        <button style={styles.retryBtn} onClick={loadPlaylist}>
          Thử lại
        </button>
      </div>
    );
  }

  // ── TRẠNG THÁI: KHÔNG TÌM THẤY ───────────────────────────
  if (!playlist) {
    return (
      <div style={{ padding: 40, color: "#b3b3b3" }}>
        Không tìm thấy playlist.
      </div>
    );
  }

  const soLuongBai = playlist.track?.length ?? 0;
  const anhBia = buildImageUrl(playlist.urlImage);

  return (
    <div style={styles.page}>
      {/* ── Header playlist ──────────────────────────────── */}
      <div style={styles.header}>
        {/* Ảnh bìa — hiện ảnh thật nếu có, không thì emoji */}
        <div style={styles.coverBox}>
          {anhBia ? (
            <img
              src={anhBia}
              alt={playlist.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
          ) : (
            <span style={{ fontSize: 56 }}>🎵</span>
          )}
        </div>

        <div style={styles.headerInfo}>
          <p style={styles.label}>Playlist</p>
          <h1 style={styles.name}>{playlist.name ?? "Playlist không tên"}</h1>
          <p style={styles.meta}>
            {soLuongBai} bài hát
            {soLuongBai === 0 && " — Playlist đang trống"}
          </p>

          {/* Nút thêm bài hát */}
          <button style={styles.addTrackBtn} onClick={() => setHienModal(true)}>
            + Thêm bài hát
          </button>
        </div>
      </div>

      {/* Thông báo lỗi inline (nếu có sau khi đã load playlist) */}
      {error && (
        <div style={styles.errorBox}>
          {error}
          <button style={styles.dismissBtn} onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      {/* Thông báo thành công tạm thời (tự ẩn sau 3 giây) */}
      {thongBao && <div style={styles.successBox}>✓ {thongBao}</div>}

      {/* ── Danh sách bài hát ────────────────────────────── */}
      {soLuongBai === 0 ? (
        // Empty state — playlist rỗng
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Playlist này chưa có bài hát nào.</p>
          <p style={styles.emptyHint}>
            Bấm <strong>"+ Thêm bài hát"</strong> để chọn từ thư viện của bạn.
          </p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={{ ...styles.th, width: 48 }}>#</th>
              <th style={styles.th}>Tiêu đề</th>
              <th style={styles.th}>Nghệ sĩ</th>
              <th style={styles.th}>Thể loại</th>
              <th style={{ ...styles.th, width: 80, textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {playlist.track.map((track, idx) => {
              const isHover = rowHover === track.id;
              const isXoaDang = dangXoa === track.id;

              return (
                <tr
                  key={track.id}
                  style={{
                    ...styles.row,
                    backgroundColor: isHover ? "#1a1a1a" : "transparent",
                  }}
                  onMouseEnter={() => setRowHover(track.id)}
                  onMouseLeave={() => setRowHover(null)}
                  // Click vào hàng → phát bài (trừ khi click vào nút xóa)
                  onClick={() => handlePhatBai(track)}
                >
                  {/* Cột số thứ tự — hover thì hiện icon play */}
                  <td style={{ ...styles.td, color: "#b3b3b3", width: 48 }}>
                    {isHover ? "▶" : idx + 1}
                  </td>

                  {/* Cột tiêu đề + ảnh nhỏ */}
                  <td style={styles.td}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div style={styles.trackThumb}>
                        {track.urlImage ? (
                          <img
                            src={buildImageUrl(track.urlImage)}
                            alt={track.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 3,
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: 16 }}>🎵</span>
                        )}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {track.title}
                      </span>
                    </div>
                  </td>

                  {/* Cột nghệ sĩ */}
                  <td style={{ ...styles.td, color: "#b3b3b3" }}>
                    {track.artist}
                  </td>

                  {/* Cột thể loại */}
                  <td style={{ ...styles.td, color: "#b3b3b3" }}>
                    {Category[track.category] ?? "—"}
                  </td>

                  {/* Cột nút xóa — chỉ hiện khi hover */}
                  <td
                    style={{ ...styles.td, textAlign: "right", width: 80 }}
                    // Ngăn click xóa lan ra hàng (nếu không → sẽ vừa phát vừa xóa)
                    onClick={(e) => e.stopPropagation()}
                  >
                    {(isHover || isXoaDang) && (
                      <button
                        style={{
                          ...styles.xoaBtn,
                          ...(isXoaDang ? styles.xoaBtnLoading : {}),
                        }}
                        onClick={() => handleXoaBai(track.id, track.title)}
                        disabled={isXoaDang}
                        title="Xóa khỏi playlist"
                      >
                        {isXoaDang ? "..." : "🗑"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ── Modal chọn bài hát ───────────────────────────── */}
      {hienModal && (
        <ModalChonBaiHat
          playlistId={id!}
          // Truyền danh sách id đã có để Modal disable nút "Thêm" với những bài đó
          danhSachDaThem={playlist.track.map((t) => t.id)}
          onClose={() => setHienModal(false)}
          onThemThanhCong={(track) => {
            handleThemThanhCong(track);
            // Không đóng modal ngay — cho phép thêm nhiều bài liên tiếp
          }}
        />
      )}
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: { padding: "24px 32px", color: "#fff", minHeight: "100%" },
  header: {
    display: "flex",
    gap: 24,
    alignItems: "flex-end",
    marginBottom: 32,
    padding: 24,
    background: "linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), #3d3d3d",
    borderRadius: 8,
  },
  coverBox: {
    width: 160,
    height: 160,
    backgroundColor: "#282828",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  headerInfo: { display: "flex", flexDirection: "column", gap: 8 },
  label: {
    color: "#b3b3b3",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    margin: 0,
  },
  name: { fontSize: 36, fontWeight: 700, margin: 0 },
  meta: { color: "#b3b3b3", fontSize: 14, margin: 0 },
  addTrackBtn: {
    marginTop: 8,
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: 20,
    padding: "10px 22px",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    width: "fit-content",
  },
  retryBtn: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: 20,
    padding: "10px 22px",
    fontWeight: 700,
    cursor: "pointer",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(247,132,130,0.12)",
    border: "1px solid rgba(247,132,130,0.3)",
    borderRadius: 6,
    padding: "10px 16px",
    marginBottom: 16,
    color: "#f78482",
    fontSize: 14,
  },
  dismissBtn: {
    background: "none",
    border: "none",
    color: "#f78482",
    cursor: "pointer",
    fontSize: 16,
    padding: "0 4px",
  },
  successBox: {
    backgroundColor: "rgba(29,185,84,0.12)",
    border: "1px solid rgba(29,185,84,0.3)",
    borderRadius: 6,
    padding: "10px 16px",
    marginBottom: 16,
    color: "#1DB954",
    fontSize: 14,
  },
  emptyState: {
    padding: "48px 0",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  emptyText: { color: "#fff", fontSize: 16, margin: 0 },
  emptyHint: { color: "#b3b3b3", fontSize: 14, margin: 0 },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { borderBottom: "1px solid #282828" },
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
    transition: "background-color 0.1s",
  },
  td: { padding: "10px 12px", fontSize: 14 },
  trackThumb: {
    width: 36,
    height: 36,
    backgroundColor: "#282828",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  xoaBtn: {
    background: "none",
    border: "none",
    color: "#b3b3b3",
    cursor: "pointer",
    fontSize: 16,
    padding: "4px 8px",
    borderRadius: 4,
    transition: "color 0.1s",
  },
  xoaBtnLoading: { opacity: 0.5, cursor: "not-allowed" },
};

// ── MODAL STYLES ──────────────────────────────────────────────
const modalStyles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  box: {
    backgroundColor: "#282828",
    borderRadius: 8,
    width: 560,
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px 16px",
    borderBottom: "1px solid #404040",
  },
  title: { fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#b3b3b3",
    fontSize: 20,
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: 1,
  },
  searchInput: {
    margin: "12px 16px",
    padding: "10px 14px",
    backgroundColor: "#404040",
    border: "1px solid #535353",
    borderRadius: 6,
    color: "#fff",
    fontSize: 14,
    outline: "none",
  },
  errorText: {
    color: "#f78482",
    fontSize: 13,
    padding: "0 16px 8px",
    margin: 0,
  },
  list: { overflowY: "auto", flex: 1, padding: "0 0 12px" },
  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 16px",
    cursor: "default",
    transition: "background-color 0.1s",
  },
  itemCover: {
    width: 40,
    height: 40,
    backgroundColor: "#404040",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemSub: { fontSize: 12, color: "#b3b3b3", marginTop: 2 },
  addBtn: {
    backgroundColor: "transparent",
    color: "#1DB954",
    border: "1px solid #1DB954",
    borderRadius: 14,
    padding: "5px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  addBtnDisabled: {
    color: "#535353",
    borderColor: "#535353",
    cursor: "default",
  },
  emptyText: {
    color: "#b3b3b3",
    fontSize: 14,
    padding: "24px 16px",
    textAlign: "center",
    margin: 0,
  },
};
