// src/types/notification.ts
// Khớp 1:1 với NotificationDto + Read (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu thông báo.
// Tương ứng Controller "Notification" trong backend.

export enum Read {
  NotRead = 0,
  Read = 1,
}

/**
 * 1 thông báo gửi tới người dùng.
 * Dùng cho: GET /api/notification
 */

export interface NotificationDto {
  id: string;       // Guid -> string

  // payload: nội dung thông báo. Backend đặt tên "payload" (không phải "content"
  // hay "message") nên ta giữ nguyên đúng tên này để khớp JSON, tránh lỗi
  // đọc field bị "undefined" do gõ sai tên.
  payload: string;  // Chú ý: backend viết thường 'payload' (không phải Payload)

  // isRead: số nguyên thể hiện trạng thái đã đọc/chưa đọc.
  //
  // TODO (cần hỏi backend dev, BẠN ĐÃ HẸN SẼ HỎI VÀ BÁO LẠI):
  // Hiện CHƯA BIẾT các giá trị (0, 1, 2...) tương ứng ý nghĩa gì
  // (ví dụ 0 = Chưa đọc, 1 = Đã đọc?). Tạm để "number" để không chặn tiến độ.
  //
  // Sau khi có câu trả lời, NÊN đổi thành "enum" cho rõ nghĩa, ví dụ:
  //   export enum NotificationReadStatus { Unread = 0, Read = 1 }
  //   isRead: NotificationReadStatus;
  isRead: Read;     // Enum 0/1
}