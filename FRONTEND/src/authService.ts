// src/authService.ts
import apiClient from './api/apiClient.ts';
import type { AuthResponseDto, LoginRequest, RegisterRequest } from './types/Auth.ts';

// ============================================================
// AUTH SERVICE — quản lý token và thông tin user trong localStorage
// Tại sao cần file này? Vì logic lưu/xóa/token không phải là
// "gọi API", mà là "quản lý state client-side".
// Tách riêng để service layer (apiClient) chỉ lo gọi API.
// ============================================================

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const authService = {
  // Đăng nhập — gọi API, lưu token nếu thành công
  login: async (data: LoginRequest): Promise<AuthResponseDto> => {
    // Gọi qua apiClient (đã có try-catch bên trong)
    // Nếu lỗi, apiClient sẽ throw Error tiếng Việt → component bắt được ở Bước 5
    const response = await apiClient.auth.login(data)

    // Lưu token vào localStorage để axios interceptor tự động gắn vào request sau này
    localStorage.setItem(TOKEN_KEY, response.token)

    // Lưu toàn bộ thông tin user (id, name, email) vào localStorage
    // Backend trả về AuthResponseDto dạng PHẲNG: { id, name, email, token }
    // KHÔNG có object user bọc trong, nên ta lưu cả response
    localStorage.setItem(USER_KEY, JSON.stringify(response))

    return response
  },

  // Đăng ký — gọi API, tự động đăng nhập luôn sau khi tạo tài khoản
  register: async (data: RegisterRequest): Promise<AuthResponseDto> => {
    const response = await apiClient.auth.register(data)

    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response))

    return response
  },

  // Đăng xuất — gọi API logout (nếu backend có) rồi xóa local data
  logout: async (): Promise<void> => {
    // Gọi API logout (backend hiện chỉ trả về thông báo, không revoke token vì JWT stateless)
    await apiClient.auth.logout()

    // Dù API logout thất bại, ta vẫn xóa local data để chắc chắn
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    // Chuyển về trang login
    window.location.href = '/login'
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  // Lấy token (dùng cho axios interceptor hoặc các thư viện khác)
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Lấy thông tin user hiện tại từ localStorage
  getCurrentUser: (): AuthResponseDto | null => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null

    try {
      // Parse JSON an toàn — nếu data bị hỏng thì trả về null
      return JSON.parse(raw) as AuthResponseDto
    } catch {
      return null
    }
  },
}

export default authService