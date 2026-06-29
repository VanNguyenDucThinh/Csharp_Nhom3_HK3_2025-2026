// src/types/Album.ts
// Khớp 1:1 với AlbumDto (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu album được backend trả về.
// import type {MediaDto} from "./Media.ts";

export interface AlbumDto {
  id: string;
  name: string;
  nameArtist: string;
  urlImage?: string;                          // urlImage: string | null;
  listMedia?: import("./Media.ts").MediaDto[];// listMedia: import("./Media.ts").MediaDto[] | null
  // listMedia?: MediaDto[]; // listMedia: MediaDto[] | null
}
