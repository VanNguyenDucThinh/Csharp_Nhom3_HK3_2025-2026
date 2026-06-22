// ====================================================================
// FILE: playlistService.ts
// MỤC ĐÍCH: Gọi các API liên quan tới Playlist.
// ====================================================================

import { axiosClient } from "./AxiosClient.ts";
import { getErrorMessage } from "./ApiHelper.ts";
import type { ApiResponse } from "./ApiResponse.ts";
import type {
  CreateOrUpdatePlaylistRequest,
  PlayListDto,
} from "./Playlist.ts";

/** Lấy danh sách playlist của người dùng đang đăng nhập. */
export async function getMyPlaylists(): Promise<PlayListDto[]> {
  try {
    const response = await axiosClient.get<ApiResponse<PlayListDto[]>>(
      "/api/playlist"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Không lấy được danh sách playlist."
      );
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Lấy chi tiết 1 playlist theo id (không cần đăng nhập). */
export async function getPlaylistById(
  playlistId: string
): Promise<PlayListDto> {
  try {
    const response = await axiosClient.get<ApiResponse<PlayListDto>>(
      `/api/playlist/${playlistId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không tìm thấy playlist.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Tạo mới 1 playlist. Dùng FormData vì có thể kèm ảnh bìa. */
export async function createPlaylist(
  request: CreateOrUpdatePlaylistRequest
): Promise<PlayListDto> {
  try {
    const formData = new FormData();
    if (request.name) formData.append("name", request.name);
    if (request.urlImage) formData.append("urlImage", request.urlImage);

    const response = await axiosClient.post<ApiResponse<PlayListDto>>(
      "/api/playlist",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Tạo playlist thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Cập nhật 1 playlist đã có. */
export async function updatePlaylist(
  playlistId: string,
  request: CreateOrUpdatePlaylistRequest
): Promise<PlayListDto> {
  try {
    const formData = new FormData();
    if (request.name) formData.append("name", request.name);
    if (request.urlImage) formData.append("urlImage", request.urlImage);

    const response = await axiosClient.put<ApiResponse<PlayListDto>>(
      `/api/playlist/${playlistId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Cập nhật playlist thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Xoá 1 playlist. */
export async function deletePlaylist(playlistId: string): Promise<void> {
  try {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `/api/playlist/${playlistId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Xoá playlist thất bại.");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Thêm 1 bài hát vào playlist. */
export async function addTrackToPlaylist(
  playlistId: string,
  mediaId: string
): Promise<void> {
  try {
    const response = await axiosClient.post<ApiResponse<null>>(
      `/api/playlist/${playlistId}/tracks`,
      { mediaId }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Thêm bài hát thất bại.");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Xoá 1 bài hát khỏi playlist. */
export async function removeTrackFromPlaylist(
  playlistId: string,
  mediaId: string
): Promise<void> {
  try {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `/api/playlist/${playlistId}/tracks/${mediaId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Xoá bài hát thất bại.");
    }
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}