// SỬA TẠI ĐÂY: Thay vì import từ 'vite', ta import từ 'vitest/config'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // CẤU HÌNH KIỂM THỬ (TESTING CONFIGURATION):
  // Lúc này thuộc tính 'test' đã được TypeScript công nhận và không còn báo lỗi nữa
  test: {
    // LOẠI TRỪ THƯ MỤC (EXCLUDE):
    // Bắt buộc loại trừ các thư mục này để hệ thống KHÔNG quét snapshot vào, tránh treo máy 45 phút
    exclude: [
      '**/node_modules/**', // Thư mục chứa các thư viện tải về (rất nặng)
      '**/dist/**',         // Thư mục chứa sản phẩm sau khi build
      '**/.cypress/**'      // Thư mục của các công cụ test khác nếu có
    ]
  }
})