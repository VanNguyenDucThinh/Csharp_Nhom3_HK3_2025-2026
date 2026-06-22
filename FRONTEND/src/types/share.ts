// src/types/share.ts
// Khớp 1:1 với ShareMediaDto + SharedItemDto + ShareStyle (C#)

export enum ShareStyle {
  Media = 0,
  Playlist = 1,
}

export interface ShareMediaDto {
  notification: string;
  isSuccess: boolean;
}

export interface SharedItemDto {
  idSender: string;       // Guid
  shareAt: string;        // ISO datetime string
  shareStyle: ShareStyle; // 0 = Media, 1 = Playlist
  idItem: string;         // Guid của media/playlist được share
  urlImage?: string;      // Có thể null
  title: string;
}