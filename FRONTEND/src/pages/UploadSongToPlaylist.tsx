// src/pages/UploadSongToPlaylist.tsx
import { useState, useRef } from "react";
import apiClient from "../api/apiClient.ts";

export function UploadSongToPlaylist({
  playlistId,
  onUploadSuccess,
}: {
  playlistId: string;
  onUploadSuccess: (track: any) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("Pop");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    // Tự động lấy tên file làm tiêu đề (bỏ đuôi .mp3, .mp4...)
    setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    setError("");
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError("Vui lòng chọn file âm thanh và nhập tiêu đề.");
      return;
    }
    setUploading(true);
    setError("");

    try {
      // BƯỚC 1: Đẩy file lên hệ thống (Giống hệt trang Upload)
      const formData = new FormData();
      formData.append("mediaFile", file);
      formData.append("title", title);
      formData.append("artist", artist || "Unknown");
      formData.append("category", category);
      formData.append("description", ""); // Gửi rỗng để không bị lỗi thiếu trường

      const uploadRes = await apiClient.media.upload(formData);
      
      // Lấy data bài hát vừa upload trả về từ Backend
      const newTrack = (uploadRes as any).data || uploadRes;

      // BƯỚC 2: Thêm bài hát vừa upload vào Playlist
      if (newTrack && newTrack.id) {
        await apiClient.playlist.addTrack(playlistId, newTrack.id);
        
        // Gọi callback để PlaylistDetail cập nhật lại UI
        onUploadSuccess(newTrack);
      } else {
        throw new Error("Không lấy được dữ liệu bài hát sau khi upload.");
      }
    } catch (err) {
      console.error("Lỗi khi upload vào playlist:", err);
      setError("Upload thất bại. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Khu vực chọn file */}
      <div 
        style={{...styles.fileZone, ...(file ? styles.fileZoneActive : {})}} 
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.flac,.aac,.ogg,.mp4"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <div style={{ fontSize: 32, marginBottom: 8 }}>{file ? "🎵" : "☁️"}</div>
        {file ? (
          <div style={styles.fileName}>{file.name}</div>
        ) : (
          <>
            <div style={{ fontWeight: 600, color: "#fff" }}>Click để chọn file Media</div>
            <div style={styles.fileText}>Hỗ trợ MP3, WAV, MP4...</div>
          </>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Form thông tin */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>Tên bài hát *</label>
        <input
          style={styles.input}
          placeholder="Nhập tên bài hát..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={uploading}
        />
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ ...styles.inputGroup, flex: 2 }}>
          <label style={styles.label}>Nghệ sĩ</label>
          <input
            style={styles.input}
            placeholder="Tùy chọn..."
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            disabled={uploading}
          />
        </div>

        <div style={{ ...styles.inputGroup, flex: 1 }}>
          <label style={styles.label}>Thể loại</label>
          <select 
            style={styles.select} 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            disabled={uploading}
          >
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="HipHop">HipHop</option>
            <option value="Jazz">Jazz</option>
            <option value="Acoustic">Acoustic</option>
            <option value="EDM">EDM</option>
          </select>
        </div>
      </div>

      {/* Nút Submit */}
      <button 
        style={{...styles.uploadBtn, ...(uploading || !file ? styles.uploadBtnDisabled : {})}} 
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? "Đang xử lý..." : "Tải lên Playlist"}
      </button>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fileZone: {
    border: "2px dashed #535353",
    borderRadius: "8px",
    padding: "24px 16px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#1a1a1a",
    transition: "all 0.2s ease",
  },
  fileZoneActive: {
    borderColor: "#1DB954",
    backgroundColor: "rgba(29, 185, 84, 0.05)",
    borderStyle: "solid",
  },
  fileText: { color: "#b3b3b3", fontSize: "13px", marginTop: "4px" },
  fileName: { color: "#1DB954", fontWeight: 700, fontSize: "14px", wordBreak: "break-all" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", color: "#b3b3b3", fontWeight: 600 },
  input: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #404040",
    borderRadius: "6px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  select: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #404040",
    borderRadius: "6px",
    padding: "10px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  uploadBtn: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: "20px",
    padding: "12px",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all 0.2s ease",
  },
  uploadBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  error: {
    color: "#f78482",
    fontSize: "13px",
    backgroundColor: "rgba(247,132,130,0.12)",
    padding: "8px 12px",
    borderRadius: "6px",
    textAlign: "center"
  }
};