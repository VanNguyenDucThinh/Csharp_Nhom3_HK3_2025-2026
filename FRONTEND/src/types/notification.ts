// src/types/notification.ts
// Khớp 1:1 với NotificationDto + Read (C#)

export enum Read {
  NotRead = 0,
  Read = 1,
}

export interface NotificationDto {
  id: string;       // Guid
  payload: string;  // Chú ý: backend viết thường 'payload' (không phải Payload)
  isRead: Read;     // Enum 0/1
}