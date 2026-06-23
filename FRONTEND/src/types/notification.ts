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
  id: string; // Guid -> string

  // payload: nội dung thông báo. Backend đặt tên "payload" (không phải "content"
  // hay "message") nên ta giữ nguyên đúng tên này để khớp JSON, tránh lỗi
  // đọc field bị "undefined" do gõ sai tên.
  payload: string; // Chú ý: backend viết thường 'payload' (không phải Payload)

  // isRead: 0 = NotRead, 1 = Read.
  // Backend dùng enum Read và serialize thành camelCase JSON.
  isRead: Read;
}
