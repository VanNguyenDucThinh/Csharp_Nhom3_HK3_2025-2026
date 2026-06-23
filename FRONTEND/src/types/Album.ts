// src/types/Album.ts
// Khớp 1:1 với AlbumDto (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu album được backend trả về.

export interface AlbumDto {
  id: string;
  name: string;
  nameArtist: string;
  urlImage?: string;
  listMedia?: import("./Media.ts").MediaDto[];
}
