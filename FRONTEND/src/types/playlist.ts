// src/types/playlist.ts
// Khớp 1:1 với PlayListDto + PlayListStatus (C#)

// Enum trạng thái playlist (Backend dùng JsonStringEnumConverter nên có thể là "Private"/"Public")
export enum PlayListStatus {
  Private = 0,
  Public = 1,
}

export interface PlayListDto {
  id: string;         // Guid
  name?: string;      // Có thể null
  urlImage?: string;  // Có thể null
  owner: string;      // Guid
  track: MediaDto[];  // Danh sách bài hát trong playlist
}