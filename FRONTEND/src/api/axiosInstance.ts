import axios from 'axios'

const BASE_URL = '/api'

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/json',},
  timeout: 120000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
  }, (error) => Promise.reject(error)
)

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

// const buildUrl = (path?: string) => path?.startsWith("http") ? path : `${domain}/${path}`;

export default axiosInstance