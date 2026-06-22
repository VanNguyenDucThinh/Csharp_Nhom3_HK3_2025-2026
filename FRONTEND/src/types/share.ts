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
  idSender: string;       // Guid -> string (id người đã gửi share)

  // shareAt: thời điểm chia sẻ. Giống "playAt" ở history.types.ts,
  // DateTime của C# khi qua JSON sẽ thành chuỗi ISO 8601, nên dùng "string".
  shareAt: string;        // ISO datetime string

  // shareStyle: xem giải thích TODO ở ShareRequest phía trên.
  shareStyle: ShareStyle; // 0 = Media, 1 = Playlist

  idItem: string;         // Guid của media/playlist được share -> string
  urlImage?: string;      // Có thể null
  title: string;
}