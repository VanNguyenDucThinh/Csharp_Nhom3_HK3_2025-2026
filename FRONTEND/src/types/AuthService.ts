// ====================================================================
// FILE: authService.ts
// MỤC ĐÍCH: Gọi các API liên quan tới Đăng nhập / Đăng ký / Đăng xuất.
// MỌI hàm trong file này đều có try-catch theo đúng yêu cầu: nếu backend
// sập hoặc mất mạng, hàm sẽ throw ra 1 Error với thông báo dễ hiểu,
// KHÔNG để app bị crash.
// ====================================================================
import { axiosClient } from "./AxiosClient.ts";
import { getErrorMessage } from "./ApiHelper.ts";
import type { ApiResponse } from "./ApiResponse.ts";

import type {
  AuthResponseDto,
  LoginRequest,
  RegisterRequest,
} from "./Auth.ts";

/**
 * Gọi API đăng ký tài khoản mới.
 * Trả về: thông tin user + token nếu thành công.
 * Nếu thất bại: throw Error kèm thông báo dễ hiểu (component gọi hàm này
 * cần tự bắt lỗi bằng try-catch của riêng nó, xem ví dụ ở Bước 5).
 */
export async function register(
  request: RegisterRequest
): Promise<AuthResponseDto> {
  try {
    const response = await axiosClient.post<ApiResponse<AuthResponseDto>>(
      "/api/auth/register",
      request
    );

    // QUAN TRỌNG: axios CHỈ vào nhánh catch khi status là lỗi (4xx, 5xx)
    // hoặc mất mạng. Nhưng backend của chúng ta có thể trả status 200
    // kèm "success: false" (ví dụ: email đã tồn tại). Vì vậy ta PHẢI
    // tự kiểm tra "success" ở đây, không thể chỉ dựa vào try-catch.
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Đăng ký không thành công.");
    }

    return response.data.data;
  } catch (error) {
    // Bắt MỌI loại lỗi (lỗi mạng, lỗi backend, lỗi tự throw ở trên),
    // rồi "dịch" lại thành 1 thông báo thống nhất, dễ hiểu cho người dùng.
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Gọi API đăng nhập.
 * Trả về: thông tin user + token nếu thành công.
 */
export async function login(request: LoginRequest): Promise<AuthResponseDto> {
  try {
    const response = await axiosClient.post<ApiResponse<AuthResponseDto>>(
      "/api/auth/login",
      request
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || "Sai email hoặc mật khẩu.");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

/**
 * Gọi API đăng xuất.
 * Đây là API có Auth = Yes, nhưng ta KHÔNG cần tự gắn header Authorization
 * ở đây, vì axiosClient (xem axiosClient.ts) đã tự động gắn token cho
 * MỌI request rồi.
 */
export async function logout(): Promise<void> {
  try {
    await axiosClient.post<ApiResponse<null>>("/api/auth/logout");
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}