// src/types/share.ts
// Khớp 1:1 với ShareMediaDto + SharedItemDto + ShareStyle (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu liên quan tới chia sẻ (share) media.
// Tương ứng Controller "Share" trong backend.

/*
 * Dữ liệu cần GỬI LÊN khi chia sẻ 1 media/playlist cho người khác.
 * Endpoint: POST /api/share
 */

export enum ShareStyle {
  Media = 0,
  Playlist = 1,
  Video = 2,
}

/*
 * Kết quả trả về sau khi gọi API chia sẻ.
 * Dùng cho: POST /api/share
 */
export interface ShareMediaDto {
  notification: string; // thông báo kết quả (ví dụ: "Đã chia sẻ thành công")
  isSuccess: boolean;
}

export interface SharedItemDto {
  idSender: string; // Guid -> string (id người đã gửi share)

  // shareAt: thời điểm chia sẻ. Giống "playAt" ở history.types.ts,
  // DateTime của C# khi qua JSON sẽ thành chuỗi ISO 8601, nên dùng "string".
  shareAt: string; // ISO datetime string

  // shareStyle: 0 = Media, 1 = Playlist, 2 = Video.
  // Giá trị này phải khớp enum ShareStyle của backend.
  shareStyle: ShareStyle;

  idItem: string; // Guid của media/playlist/video được share -> string
  urlImage?: string; // Có thể null
  title: string;
}
export interface NameUserShareDto{
  id: string;
  name: string;
  email: string;
  urlImage?: string;
}
