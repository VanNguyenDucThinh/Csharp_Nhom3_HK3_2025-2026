// src/api/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  // Bạn có thể sửa cổng (Port) này lại cho đúng với cổng chạy Backend C# của bạn
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bộ đánh chặn (Interceptor) tự động kiểm tra và gắn Token vào Header của mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;