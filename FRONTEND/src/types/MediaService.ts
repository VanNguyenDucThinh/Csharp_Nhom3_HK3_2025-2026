// ====================================================================
// FILE: mediaService.ts
// MỤC ĐÍCH: Gọi các API liên quan tới Media (bài hát / video / tìm kiếm).
// ====================================================================

import { axiosClient } from "./AxiosClient.ts";
import { getErrorMessage } from "./ApiHelper.ts";
import type { ApiResponse } from "./ApiResponse.ts";
import type {
  AudioMediaDto,
  FavoriteDto,
  MediaDto,
  SearchTrendingDto,
  VideoDto,
} from "./Media.ts";

/** Lấy thông tin chi tiết để phát 1 bài hát (audio), theo id. */
export async function getAudioById(mediaId: string): Promise<AudioMediaDto> {
  try {
    const response = await axiosClient.get<ApiResponse<AudioMediaDto>>(
      `/api/media/Audio/${mediaId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không tìm thấy bài hát.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Lấy thông tin chi tiết để phát 1 video, theo id.
 *
 * LƯU Ý QUAN TRỌNG: Theo hợp đồng API, endpoint này CÓ THỂ trả về JSON
 * bình thường (ApiResponse<VideoDto>), HOẶC trả thẳng dữ liệu video dạng
 * stream (status 206) khi trình duyệt yêu cầu tải theo từng đoạn nhỏ
 * (Range Request) — đây là cách hoạt động thông thường của thẻ <video>
 * trong HTML. Hàm dưới đây chỉ xử lý trường hợp 1 (lấy thông tin JSON).
 * Việc PHÁT video thực tế nên giao cho thẻ <video src="..."> trỏ trực
 * tiếp tới URL stream, KHÔNG gọi qua hàm này.
 */
export async function getVideoById(mediaId: string): Promise<VideoDto> {
  try {
    const response = await axiosClient.get<ApiResponse<VideoDto>>(
      `/api/media/Video/${mediaId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không tìm thấy video.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Tìm kiếm media/playlist theo từ khoá, có phân trang. */
export async function searchMedia(
  query: string,
  pageNumber: number,
  pageSize: number
): Promise<SearchTrendingDto> {
  try {
    const response = await axiosClient.get<ApiResponse<SearchTrendingDto>>(
      "/api/media/search",
      {
        // axios sẽ tự chuyển object này thành query string,
        // ví dụ: ?q=...&pageNumber=1&pageSize=20
        params: { q: query, pageNumber, pageSize },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Tìm kiếm thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Lấy danh sách media/playlist đang trending (nổi bật), có phân trang. */
export async function getTrending(
  pageNumber: number,
  pageSize: number
): Promise<SearchTrendingDto> {
  try {
    const response = await axiosClient.get<ApiResponse<SearchTrendingDto>>(
      "/api/media/trend",
      { params: { pageNumber, pageSize } }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Không lấy được danh sách trending."
      );
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Đánh dấu yêu thích 1 media. */
export async function favoriteMedia(mediaId: string): Promise<FavoriteDto> {
  try {
    const response = await axiosClient.post<ApiResponse<FavoriteDto>>(
      `/api/media/favorite/${mediaId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Yêu thích thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Bỏ yêu thích 1 media. */
export async function unfavoriteMedia(mediaId: string): Promise<FavoriteDto> {
  try {
    const response = await axiosClient.put<ApiResponse<FavoriteDto>>(
      `/api/media/unfavorite/${mediaId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Bỏ yêu thích thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Lấy danh sách media đã yêu thích của người dùng đang đăng nhập. */
export async function getFavoriteList(): Promise<MediaDto[]> {
  try {
    const response = await axiosClient.get<ApiResponse<MediaDto[]>>(
      "/api/media/ListFavorite"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Không lấy được danh sách yêu thích."
      );
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Upload 1 file media (audio/video) lên server.
 * "file" là đối tượng File lấy từ <input type="file"> trên giao diện.
 *
 * Trả về "object" theo đúng hợp đồng API (ApiResponse<object>) — backend
 * chưa định nghĩa rõ cấu trúc trả về cụ thể, nên tạm dùng "unknown" thay vì
 * "any", để TypeScript vẫn BẮT BUỘC ta kiểm tra kiểu trước khi dùng,
 * tránh lỗi ngầm khi backend thay đổi cấu trúc trả về sau này.
 */
export async function uploadMedia(file: File): Promise<unknown> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<ApiResponse<unknown>>(
      "/api/media/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Upload thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}