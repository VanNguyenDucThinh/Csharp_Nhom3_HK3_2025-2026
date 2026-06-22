// ====================================================================
// FILE: userService.ts
// MỤC ĐÍCH: Gọi các API liên quan tới hồ sơ người dùng và theo dõi (follow).
// ====================================================================

import { axiosClient } from "./AxiosClient.ts";
import { getErrorMessage } from "./ApiHelper.ts";
import type { ApiResponse } from "./ApiResponse.ts";
import type {
  FollowDto,
  ProfileUserDto,
  UpdateProfileRequest,
} from "./User.ts";

/** Lấy hồ sơ của CHÍNH người dùng đang đăng nhập. */
export async function getMyProfile(): Promise<ProfileUserDto> {
  try {
    const response = await axiosClient.get<ApiResponse<ProfileUserDto>>(
      "/api/user/profile"
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không lấy được hồ sơ.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Lấy hồ sơ của 1 người dùng KHÁC, theo id (không cần đăng nhập). */
export async function getUserById(userId: string): Promise<ProfileUserDto> {
  try {
    const response = await axiosClient.get<ApiResponse<ProfileUserDto>>(
      `/api/user/${userId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Không tìm thấy người dùng.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Cập nhật hồ sơ. Endpoint này nhận "multipart/form-data" (vì có thể
 * upload ảnh đại diện), nên ta phải đóng gói dữ liệu vào FormData
 * thay vì gửi thẳng object JavaScript như JSON thông thường.
 */
export async function updateProfile(
  request: UpdateProfileRequest
): Promise<ProfileUserDto> {
  try {
    // Tạo 1 đối tượng FormData, rồi lần lượt thêm từng field vào.
    // Chỉ thêm field nào CÓ giá trị (tránh gửi field rỗng/undefined lên backend).
    const formData = new FormData();
    if (request.name) formData.append("name", request.name);
    if (request.bio) formData.append("bio", request.bio);
    if (request.avatarUrl) formData.append("avatarUrl", request.avatarUrl);

    const response = await axiosClient.put<ApiResponse<ProfileUserDto>>(
      "/api/user/profile",
      formData,
      {
        // Báo cho axios biết đây là dữ liệu dạng multipart, không phải JSON.
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Cập nhật hồ sơ thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Theo dõi (follow) 1 người dùng khác. */
export async function followUser(userId: string): Promise<FollowDto> {
  try {
    const response = await axiosClient.post<ApiResponse<FollowDto>>(
      `/api/user/${userId}/follow`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Theo dõi thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/** Bỏ theo dõi (unfollow) 1 người dùng khác. */
export async function unfollowUser(userId: string): Promise<FollowDto> {
  try {
    const response = await axiosClient.delete<ApiResponse<FollowDto>>(
      `/api/user/${userId}/follow`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Bỏ theo dõi thất bại.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}