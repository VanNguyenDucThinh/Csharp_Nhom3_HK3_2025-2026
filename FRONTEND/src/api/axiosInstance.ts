import axios from 'axios'

// SỬA CHÍNH TẠI ĐÂY: Xóa đoạn http://localhost... đi. 
// Chỉ để lại "/api" để bắt buộc Axios phải chạy qua cánh cửa Proxy ở trên.
const BASE_URL = '/api' 

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
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

export default axiosInstance