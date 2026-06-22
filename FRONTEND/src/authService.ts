// src/authService.ts
import apiClient, { type AuthResponse, type LoginRequest, type RegisterRequest } from './api/apiClient'

// =============================================
// AUTH SERVICE — quản lý token và thông tin user
// =============================================

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const authService = {

  // Đăng nhập — lưu token + user vào localStorage
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.auth.login(data)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    return response
  },

  // Đăng ký — tự động đăng nhập luôn sau khi tạo tài khoản
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.auth.register(data)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    return response
  },

  // Đăng xuất — xóa hết localStorage
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    window.location.href = '/login'
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  },

  // Lấy token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },
}

export default authService