// src/api/axiosInstance.ts
import axios from 'axios'

// Đọc URL từ .env — không hardcode
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Cấu hình instance dùng chung cho toàn bộ dự án
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 giây để hạn chế lỗi timeout
})

// Interceptor: tự động gắn JWT token vào mọi request
// Tại sao cần interceptor? Vì không muốn gọi localStorage.getItem('token')
// rải rác ở từng hàm service. Viết 1 lần ở đây, tự động áp dụng cho cả 28 endpoint.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor: tự động logout nếu token hết hạn (lỗi 401)
// Tại sao? Vì khi backend trả 401, token đã hết hạn hoặc bị revoke.
// Frontend cần xóa token khỏi localStorage và chuyển về trang login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance