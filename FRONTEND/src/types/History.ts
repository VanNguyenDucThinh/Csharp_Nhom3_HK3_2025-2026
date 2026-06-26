// ====================================================================
// FILE: FRONTEND/src/types/history.ts
// MỤC ĐÍCH: Định nghĩa dữ liệu lịch sử phát nhạc/video của người dùng.
// Tương ứng Controller "History" trong backend.
// ====================================================================

/**
 * 1 dòng lịch sử phát nhạc/video.
 * Dùng cho: GET /api/history
 */
export interface HistoryMediaDto {
  idMedia: string; // Guid -> string
  urlImage: string;
  title: string;
  artist: string;

  // playAt: thời điểm đã phát. Bên C# là kiểu DateTime.
  // Khi serialize qua JSON, DateTime luôn trở thành 1 CHUỖI theo chuẩn ISO 8601
  // (ví dụ: "2026-06-22T10:30:00Z"), nên ở TypeScript ta khai báo là "string",
  // KHÔNG phải kiểu Date. Nếu cần hiển thị đẹp (ví dụ "22/06/2026"), ta sẽ
  // tự chuyển đổi chuỗi này thành Date NGAY TRƯỚC KHI hiển thị ở component,
  // không lưu sẵn dưới dạng Date trong interface.
  playAt: string;
}