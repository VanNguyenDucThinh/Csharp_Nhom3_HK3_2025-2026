// src/api/axiosInstance.ts
import axios from 'axios'

// Đọc URL từ file .env — không hardcode
// Nếu .env chưa có thì fallback về localhost:5000 // Đường dẫn API giả định của dự án
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Cấu hình một instance API dùng chung cho toàn bộ dự án TuneVault
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000 // Tăng thời gian chờ lên 15 giây (15000ms) để hạn chế lỗi Timeout 504
})

// Interceptor: tự động gắn JWT token vào mọi request
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

// Hàm lấy danh sách bài hát từ Backend
export const getSongsList = async () => {
  try {
    // Thực hiện gọi API để lấy dữ liệu bài hát
    const response = await axiosInstance.get('/songs');

    // Nếu thành công, trả về dữ liệu danh sách bài hát nhận được từ Server
    return response.data;
    
  } catch (error) {
    // XỬ LÝ LỖI (EXCEPTION HANDLING): Bắt toàn bộ lỗi phát sinh khi gọi API
    // Sử dụng unknown thay vì any để tuân thủ quy tắc TypeScript nghiêm ngặt hơn.
    
    // Kiểm tra xem lỗi có phải do hết thời gian chờ (Timeout) hay không
    const err = error as { code?: string; message?: string }
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      // Hiển thị thông báo cho người dùng (tương tự MessageBox trong C#)
      alert('Hệ thống phản hồi quá lâu. Vui lòng kiểm tra kết nối mạng và thử lại!');
    } else {
      // Xử lý các trường hợp lỗi khác (ví dụ: Server mất kết nối hoàn toàn)
      alert('Đã xảy ra lỗi không xác định khi kết nối đến TuneVault. Vui lòng thử lại sau!');
    }
    
    // Trả về một mảng rỗng để Frontend không bị crash và giao diện vẫn có thể hiển thị tiếp
    return [];
  }
};

export default axiosInstance