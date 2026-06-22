// src/types/media.ts
// Khớp 1:1 với MediaDto + AudioMediaDto + SearchTrendingDto (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu liên quan tới Media (bài hát / video).
// Tương ứng Controller "Media" trong backend.


// Import PlayListDto từ file playlist.types.ts vì kết quả tìm kiếm/trending
// có thể chứa danh sách playlist. Dùng "import type" vì ta CHỈ dùng PlayListDto
// để khai báo KIỂU dữ liệu, không dùng để chạy code thật (TypeScript sẽ tự
// xoá dòng import này khi build ra JavaScript, không làm nặng file build).
import type { PlayListDto } from "./Playlist.ts";

// Enum Category từ C# (Category = 0..4)
export enum Category {
  Pop = 0,
  Rock = 1,
  Jazz = 2,
  Classical = 3,
  HipHop = 4,
}

// DTO chính cho Media
/*
 * Thông tin cơ bản của 1 Media (dùng trong danh sách, tìm kiếm, trending...).
 * Đây KHÔNG phải dữ liệu chi tiết để phát nhạc (xem AudioMediaDto / VideoDto).
 */
export interface MediaDto {
  id: string;         // Guid -> string
  title: string;
  artist: string;
  urlMedia: string;   // Backend dùng UrlMedia (PascalCase)
  urlImage: string;   // Backend dùng UrlImage

 
  // category: số nguyên đại diện cho LOẠI media (ví dụ: nhạc, video...).
  //
  // TODO (QUAN TRỌNG - cần hỏi backend dev):
  // Hiện CHƯA BIẾT giá trị 0, 1, 2... tương ứng ý nghĩa gì
  // (ví dụ 0 = Audio, 1 = Video?). Tạm để kiểu "number" để không chặn tiến độ.
  //
  // Sau khi có câu trả lời, NÊN đổi thành kiểu "enum" cho rõ nghĩa, ví dụ:
  //   export enum MediaCategory { Audio = 0, Video = 1 }
  //   category: MediaCategory;
  // Lúc đó code sẽ tự nhiên, dễ đọc hơn (so sánh "category === MediaCategory.Audio"
  // dễ hiểu hơn nhiều so với "category === 0").
  category: Category;

  owner: string;      // Guid của người upload -> string
}

// DTO dùng cho GetById (AudioMediaDto) — thiếu một số trường so với MediaDto
/*
 * Thông tin chi tiết để PHÁT 1 bài hát (Audio).
 * Dùng cho: GET /api/media/Audio/{id}
*/
export interface AudioMediaDto {
  title: string;
  artist: string;

  // Đánh dấu "?" vì backend khai báo các field này là nullable (có thể null)
  // bên C# (dùng dấu "?" sau kiểu, ví dụ "string? urlImage").
  urlImage?: string;  // Có thể null
  urlMedia?: string;  // Có thể null; đường link file âm thanh thật để frontend phát
}

/**
 * Thông tin chi tiết để PHÁT 1 video.
 * Dùng cho: GET /api/media/Video/{id}
 *
 * Lưu ý: endpoint này có thể trả về dạng JSON (ApiResponse<VideoDto>)
 * HOẶC trả thẳng dạng stream nhị phân (status 206 - Partial Content)
 * khi trình duyệt yêu cầu tải video theo từng đoạn (Range Request).
 * Interface này chỉ áp dụng cho trường hợp trả JSON thông thường.
 */
export interface VideoDto {
  title: string;
  artist: string;
  urlImage?: string;
  urlMedia?: string;
}

// Response của endpoint /api/media/search
/*
 * Kết quả tìm kiếm / trending, có thể chứa NHIỀU loại danh sách khác nhau
 * trong cùng 1 lần trả về (media, playlist, theo nghệ sĩ, đang nổi...).
 * Dùng cho: GET /api/media/search và GET /api/media/trend
 *
 * Mỗi danh sách đều đánh dấu "?" vì có thể backend chỉ trả về
 * danh sách phù hợp với loại tìm kiếm, danh sách khác để trống.
 */
export interface SearchTrendingDto {
          listMedia?: MediaDto[];        // Kết quả tìm kiếm
       listPlayList?: PlayListDto[];    // Playlist liên quan: chi tiết PlayListDto xem ở file src/types/playlist.ts
  listMediaByArtist?: MediaDto[];       // Cùng artist
           trending?: MediaDto[];       // Media đang thịnh hành

           // Hai field dưới đây dùng để làm PHÂN TRANG (pagination) ở giao diện,
           // ví dụ hiển thị "Trang 2/10" hoặc nút "Xem thêm".
          currentPage: number;
        totalResults: number;
}

/*
 * Kết quả trả về sau khi Yêu thích / Bỏ yêu thích 1 media.
 * Dùng cho: POST /api/media/favorite/{id} và PUT /api/media/unfavorite/{id}
 */
export interface FavoriteDto {
  isFavorite: boolean;
  isSuccess: boolean;
  message: string;
}