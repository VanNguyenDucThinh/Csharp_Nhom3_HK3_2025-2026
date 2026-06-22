// src/types/media.ts
// Khớp 1:1 với MediaDto + AudioMediaDto + SearchTrendingDto (C#)

// Enum Category từ C# (Category = 0..4)
export enum Category {
  Pop = 0,
  Rock = 1,
  Jazz = 2,
  Classical = 3,
  HipHop = 4,
}

// DTO chính cho Media
export interface MediaDto {
  id: string;         // Guid
  title: string;
  artist: string;
  urlMedia: string;   // Backend dùng UrlMedia (PascalCase)
  urlImage: string;   // Backend dùng UrlImage
  category: Category;
  owner: string;      // Guid của người upload
}

// DTO dùng cho GetById (AudioMediaDto) — thiếu một số trường so với MediaDto
export interface AudioMediaDto {
  title: string;
  artist: string;
  urlImage?: string;  // Có thể null
  urlMedia?: string;  // Có thể null
}

// Response của endpoint /api/media/search
export interface SearchTrendingDto {
  listMedia: MediaDto[];           // Kết quả tìm kiếm
  listPlayList: PlayListDto[];     // Playlist liên quan
  listMediaByArtist: MediaDto[];   // Cùng artist
  trending: MediaDto[];            // Media đang thịnh hành
  currentPage: number;
  totalResults: number;
}