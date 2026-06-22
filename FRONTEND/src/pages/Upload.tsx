// src/pages/Upload.tsx
// Trang upload media — bắt buộc theo đề (F1: Media Players + Upload)
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { showApiError } from "../api/apiClient";

const USE_MOCK = true;
const ACCEPTED_AUDIO = [".mp3", ".wav", ".flac", ".aac", ".ogg"];
const ACCEPTED_VIDEO = [".mp4", ".webm", ".mkv", ".avi"];

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [mediaType, setMediaType] = useState<"audio" | "video">("audio");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (selected: File) => {
    const ext = "." + selected.name.split(".").pop()?.toLowerCase();
    const isAudio = ACCEPTED_AUDIO.includes(ext);
    const isVideo = ACCEPTED_VIDEO.includes(ext);
    if (!isAudio && !isVideo) {
      setError("Định dạng không hỗ trợ. Dùng mp3, wav, mp4, webm...");
      return;
    }
    setFile(selected);
    setMediaType(isVideo ? "video" : "audio");
    setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError("Vui lòng chọn file và nhập tiêu đề.");
      return;
    }
    setUploading(true);
    setProgress(0);
    setError("");

    if (USE_MOCK) {
      // Giả lập tiến trình upload
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) => setTimeout(r, 80));
        setProgress(i);
      }
      setSuccess(true);
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("artist", artist || "Unknown");
      formData.append("type", mediaType);
      await apiClient.media.upload(formData);
      setSuccess(true);
    } catch (err) {
      // Nếu backend upload lỗi, vẫn hiện alert để user biết nguyên nhân chung.
      showApiError('Upload thất bại. Backend chưa phản hồi hoặc mạng có vấn đề.', err)
      setError("Upload thất bại. Vui lòng thử lại.")
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setTitle("");
    setArtist("");
    setSuccess(false);
    setProgress(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Upload thành công!</h2>
          <p style={styles.successSub}>
            "{title}" đã được thêm vào thư viện của bạn.
          </p>
          <div style={styles.successBtns}>
            <button style={styles.btnPrimary} onClick={reset}>
              Upload thêm
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => navigate("/library")}
            >
              Vào thư viện
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Tải lên Media</h1>
      <p style={styles.sub}>
        Hỗ trợ: MP3, WAV, FLAC (audio) · MP4, WebM (video)
      </p>

      <div style={styles.layout}>
        {/* Khu vực chọn file */}
        <div
          style={{
            ...styles.dropZone,
            ...(dragOver ? styles.dropActive : {}),
            ...(file ? styles.dropHasFile : {}),
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={[...ACCEPTED_AUDIO, ...ACCEPTED_VIDEO].join(",")}
            style={{ display: "none" }}
            onChange={(e) =>
              e.target.files?.[0] && handleFileSelect(e.target.files[0])
            }
          />
          {file ? (
            <div style={styles.fileInfo}>
              <div style={styles.fileIcon}>
                {mediaType === "video" ? "🎬" : "🎵"}
              </div>
              <div style={styles.fileName}>{file.name}</div>
              <div style={styles.fileSize}>
                {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                {mediaType === "video" ? "Video" : "Audio"}
              </div>
              <button
                style={styles.changeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  reset();
                }}
              >
                Đổi file
              </button>
            </div>
          ) : (
            <div style={styles.dropContent}>
              <div style={styles.uploadIcon}>☁️</div>
              <div style={styles.dropText}>Kéo thả file vào đây</div>
              <div style={styles.dropSub}>hoặc click để chọn file</div>
            </div>
          )}
        </div>

        {/* Form metadata */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Tiêu đề *</label>
            <input
              style={styles.input}
              placeholder="Tên bài hát / video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Nghệ sĩ</label>
            <input
              style={styles.input}
              placeholder="Tên nghệ sĩ (tùy chọn)"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Loại media</label>
            <div style={styles.typeToggle}>
              <button
                style={{
                  ...styles.typeBtn,
                  ...(mediaType === "audio" ? styles.typeBtnActive : {}),
                }}
                onClick={() => setMediaType("audio")}
              >
                🎵 Audio
              </button>
              <button
                style={{
                  ...styles.typeBtn,
                  ...(mediaType === "video" ? styles.typeBtnActive : {}),
                }}
                onClick={() => setMediaType("video")}
              >
                🎬 Video
              </button>
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          {/* Progress bar */}
          {uploading && (
            <div style={styles.progressBox}>
              <div style={styles.progressTrack}>
                <div
                  style={{ ...styles.progressFill, width: `${progress}%` }}
                />
              </div>
              <span style={styles.progressText}>{progress}%</span>
            </div>
          )}

          <button
            style={{
              ...styles.uploadBtn,
              ...(uploading || !file ? styles.uploadBtnDisabled : {}),
            }}
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? `Đang tải lên... ${progress}%` : "⬆ Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "32px", color: "#fff", maxWidth: 900, margin: "0 auto" },
  title: { fontSize: 28, fontWeight: 800, marginBottom: 6 },
  sub: { color: "#b3b3b3", fontSize: 14, marginBottom: 32 },
  layout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 },

  dropZone: {
    border: "2px dashed #404040",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  dropActive: { borderColor: "#1DB954", backgroundColor: "#0a1f0a" },
  dropHasFile: {
    borderColor: "#1DB954",
    borderStyle: "solid",
    backgroundColor: "#0d1f0d",
  },
  dropContent: { textAlign: "center", padding: 32 },
  uploadIcon: { fontSize: 48, marginBottom: 16 },
  dropText: { fontSize: 16, fontWeight: 700, marginBottom: 8 },
  dropSub: { fontSize: 13, color: "#b3b3b3" },

  fileInfo: { textAlign: "center", padding: 24 },
  fileIcon: { fontSize: 52, marginBottom: 12 },
  fileName: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 6,
    wordBreak: "break-all",
  },
  fileSize: { fontSize: 12, color: "#1DB954", marginBottom: 16 },
  changeBtn: {
    backgroundColor: "transparent",
    color: "#b3b3b3",
    border: "1px solid #535353",
    borderRadius: 20,
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: 12,
  },

  form: { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, fontWeight: 700, color: "#b3b3b3" },
  input: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #404040",
    borderRadius: 6,
    padding: "12px 16px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
  },
  typeToggle: { display: "flex", gap: 8 },
  typeBtn: {
    flex: 1,
    backgroundColor: "#282828",
    border: "1px solid #404040",
    color: "#b3b3b3",
    borderRadius: 6,
    padding: "10px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  },
  typeBtnActive: {
    borderColor: "#1DB954",
    color: "#1DB954",
    backgroundColor: "#0a1f0a",
  },

  error: { color: "#f15e6c", fontSize: 13, textAlign: "center" },

  progressBox: { display: "flex", alignItems: "center", gap: 12 },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#282828",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1DB954",
    borderRadius: 3,
    transition: "width 0.1s",
  },
  progressText: { fontSize: 12, color: "#b3b3b3", minWidth: 36 },

  uploadBtn: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: 30,
    padding: "14px",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  },
  uploadBtnDisabled: { opacity: 0.5, cursor: "not-allowed" },

  // Success state
  successBox: { textAlign: "center", padding: "60px 32px" },
  successIcon: { fontSize: 64, marginBottom: 20 },
  successTitle: { fontSize: 26, fontWeight: 800, marginBottom: 8 },
  successSub: { color: "#b3b3b3", fontSize: 15, marginBottom: 32 },
  successBtns: { display: "flex", gap: 12, justifyContent: "center" },
  btnPrimary: {
    backgroundColor: "#1DB954",
    color: "#000",
    border: "none",
    borderRadius: 30,
    padding: "12px 28px",
    fontWeight: 700,
    cursor: "pointer",
  },
  btnSecondary: {
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid #535353",
    borderRadius: 30,
    padding: "12px 28px",
    fontWeight: 700,
    cursor: "pointer",
  },
};
