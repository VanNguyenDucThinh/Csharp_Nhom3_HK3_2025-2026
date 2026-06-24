// src/types/media.ts
// Khớp 1:1 với MediaDto + AudioMediaDto + SearchTrendingDto (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu liên quan tới Media (bài hát / video).
// Tương ứng Controller "Media" trong backend.

import type { AlbumDto } from "./Album.ts";
import type { PlayListDto } from "./Playlist.ts";

/**
 * Enum Category (Thể loại nhạc) tương ứng từ Backend C#
 */
export enum Category {
  Pop = 0,
  Rock = 1,
  Jazz = 2,
  Classical = 3,
  HipHop = 4,
  Remix = 5,
  Buon = 6,
}

/**
 * DTO chính cho Media hiển thị trên giao diện (Danh sách, Tìm kiếm, Trending...)
 * Đây KHÔNG phải dữ liệu chi tiết chứa stream để phát nhạc trực tiếp.
 */
export interface MediaDto {
  id: string;        // Guid -> string
  title: string;
  artist: string;
  urlImage: string;  // Đường dẫn ảnh đại diện
  category: Category; // Thể loại nhạc (Pop, Rock, Remix...)
  owner: string;     // Guid của người upload -> string
}

/**
 * Thông tin chi tiết để PHÁT 1 bài hát (Audio).
 * Dùng cho: GET /api/media/Audio/{id}
 */
export interface AudioMediaDto {
  title: string;
  artist: string;
  urlImage?: string; // Dấu "?" tương ứng kiểu nullable (string?) trong C#
  urlMedia?: string; // Link stream âm thanh thật để trình phát nhạc hoạt động
}

/**
 * Thông tin chi tiết để PHÁT 1 video.
 * Dùng cho: GET /api/media/Video/{id}
 */
export interface VideoDto {
  title: string;
  artist: string;
  urlImage?: string;
  urlMedia?: string;
}

/**
 * Kết quả trả về từ endpoint Tìm kiếm và Trending
 * Dùng cho: GET /api/media/search và GET /api/media/trend
 */
export interface SearchTrendingDto {
  listMedia?: MediaDto[];
  listPlayList?: PlayListDto[];
  listMediaByArtist?: MediaDto[];
  listAlbum?: AlbumDto[];
  listTrending?: MediaDto[];

  // Phục vụ cho tính năng phân trang (Pagination) trên UI
  currentPage: number;
  totalResults: number;
}

/**
 * Kết quả trả về sau khi tiến hành Yêu thích / Bỏ yêu thích
 * Dùng cho: POST /api/media/favorite/{id} và PUT /api/media/unfavorite/{id}
 */
export interface FavoriteDto {
  isFavorite: boolean;
  isSuccess: boolean;
  message: string;
}