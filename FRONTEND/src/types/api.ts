// src/types/api.ts
// Khớp 1:1 với ApiResponse<T> (C#)

// Wrapper chuẩn: { success, message, data, errors }
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
  errors: string[] | null;
}

// Dùng cho các endpoint không trả data (logout, xóa...)
export interface ApiResponseNoData {
  success: boolean;
  message: string | null;
  data: null;
  errors: string[] | null;
}