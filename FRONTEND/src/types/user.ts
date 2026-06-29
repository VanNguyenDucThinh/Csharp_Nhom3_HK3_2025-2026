// src/types/user.ts
// Khớp 1:1 với ProfileUserDto + FollowDto (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu liên quan tới User (hồ sơ, theo dõi).
// Tương ứng Controller "User" trong backend.


/**
 * Thông tin hồ sơ người dùng.
 * Dùng cho: GET /api/user/profile và GET /api/user/{id}
 */
export interface ProfileUserDto {
  id: string;         // Guid
  name: string;       // Backend dùng Name, KHÔNG phải username
  avatarUrl: string;  // Backend trả về string, không phải null (có default)
  bio: string;        // Backend trả về string, có thể rỗng
}

/**
 * Dữ liệu cần GỬI LÊN khi cập nhật hồ sơ (PUT /api/user/profile).
 *
 * Lưu ý quan trọng: endpoint này nhận "multipart/form-data" (vì có khả năng
 * upload ảnh đại diện), KHÔNG PHẢI JSON thường. Vì vậy ở Bước 3 (viết Service
 * gọi API), ta sẽ KHÔNG dùng JSON.stringify() cho request này, mà phải
 * đóng gói dữ liệu vào một đối tượng FormData. Interface dưới đây chỉ
 * mô tả "có những field nào", phần đóng gói thực tế sẽ làm ở bước sau.
 */
export interface UpdateProfileRequest {
  name?: string;      // name: string | null;
  avatarUrl?: string; // có thể là file ảnh, sẽ xử lý cụ thể ở Bước 3
  bio?: string;       // name: string | null
}

/**
 * Kết quả trả về sau khi Follow / Unfollow một user.
 * Dùng cho: POST /api/user/{id}/follow và DELETE /api/user/{id}/follow
 */
export interface FollowDto {
  isFollow: boolean;
  isSuccess: boolean;
  message: string;
}