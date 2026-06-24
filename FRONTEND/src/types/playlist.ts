// src/types/playlist.ts
// Khớp 1:1 với PlayListDto + PlayListStatus (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu liên quan tới Playlist.
// Tương ứng Controller "Playlist" trong backend.

import type { MediaDto } from "./Media.ts";


// Enum trạng thái playlist (Backend dùng JsonStringEnumConverter nên có thể là "Private"/"Public")
export enum PlayListStatus {
  Private = 0,
  Public = 1,
}

/*
 * Thông tin 1 playlist, kèm danh sách bài hát bên trong (track).
 * Dùng cho: GET /api/playlist, GET /api/playlist/{id}, POST, PUT /api/playlist/{id}
 */
export interface PlayListDto {
  id: string;         // Guid -> string
  name?: string;      // Có thể null vì backend cho phép playlist chưa đặt tên
  urlImage?: string;  // Có thể null
  owner: string;      // Guid -> string (id của user sở hữu playlist)
  track: MediaDto[];  // track: Danh sách bài hát trong playlist
}

/**
 * Dữ liệu cần GỬI LÊN khi tạo mới hoặc cập nhật playlist.
 * Endpoint: POST /api/playlist  và  PUT /api/playlist/{id}
 *
 * Lưu ý: 2 endpoint này nhận "multipart/form-data" (vì có thể upload ảnh
 * bìa playlist), nên ở Bước 3 ta sẽ đóng gói dữ liệu này vào FormData,
 * KHÔNG dùng JSON.stringify().
 */
export interface CreateOrUpdatePlaylistRequest {
  name?: string;
  file?: File; // ✅ thêm field file để upload ảnh // IFormFile từ backend → trong FormData dùng key "File"
  isPublic: number;  // PlayListStatus: 0 = Private, 1 = Public (theo backend enum)
}
 
/**
 * Dữ liệu cần GỬI LÊN khi thêm 1 bài hát vào playlist.
 * Endpoint: POST /api/playlist/{id}/tracks
 */
export interface AddTrackToPlaylistRequest {
  mediaId: string; // Guid -> string
}