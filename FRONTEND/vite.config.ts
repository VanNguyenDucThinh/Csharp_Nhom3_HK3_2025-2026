import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 1. CẤU HÌNH SERVER & PROXY (Vượt rào CORS cho lệnh DELETE)
  // Bất kỳ API nào gọi vào '/api' sẽ được Vite ngầm chuyển sang port 5124 của C#
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5124',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // 2. CẤU HÌNH KIỂM THỬ (Giữ nguyên của bạn)
  test: {
    exclude: [
      '**/node_modules/**', 
      '**/dist/**',         
      '**/.cypress/**'      
    ]
  }
})