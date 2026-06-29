// ====================================================================
// FILE: src/types/api.ts
// Khớp 1:1 với ApiResponse<T> (C#)
// MỤC ĐÍCH: Định nghĩa "cái hộp" mà MỌI api của backend trả về.
// Backend luôn bọc dữ liệu thật (data) vào trong 1 cái hộp chung này,
// nên ta chỉ cần định nghĩa 1 lần, dùng lại cho tất cả các API.
// ====================================================================

/**
 * ApiResponse<T> là kiểu generic (kiểu "rỗng ruột", ai dùng thì tự điền T là gì).
 *
 * Ví dụ: ApiResponse<ProfileUserDto> nghĩa là "hộp chuẩn, bên trong data là 1 ProfileUserDto".
 *
 * Tại sao dùng generic thay vì viết riêng từng interface (VD: AuthApiResponse,
 * UserApiResponse...)? Vì cấu trúc hộp luôn giống nhau (success, message, data, errors),
 * chỉ có "ruột" (data) là khác nhau theo từng API. Dùng generic giúp viết 1 lần,
 * tái sử dụng cho toàn bộ 28 endpoint, tránh lặp code.
 */

// Wrapper chuẩn: { success, message, data, errors }
export interface ApiResponse<T> {
  // success: backend báo true/false xem request có chạy thành công không.
  // Ta luôn phải kiểm tra field này TRƯỚC KHI đụng vào "data",
  // vì nếu success = false thì data có thể là null/undefined.
  success: boolean;

  // message: chuỗi thông báo dùng để hiển thị cho người dùng
  // (ví dụ: "Đăng nhập thành công" hoặc "Sai email hoặc mật khẩu").
  message: string | null;                    // Cách 2: message?: string

  // data: dữ liệu thật mà ta cần dùng.
  // Đánh dấu "?" (optional) vì khi success = false, có thể backend không trả data.
  data: T | null;                            // Cách 2:    data?: T

  // errors: danh sách lỗi chi tiết (ví dụ lỗi validate từng field khi đăng ký).
  // Đánh dấu "?" vì không phải lúc nào backend cũng trả mảng này
  // (thường chỉ có khi success = false).
  errors: string[] | null;                  // Cách 2:  errors?: string[];
}

// Dùng cho các endpoint không trả data (logout, xóa...)
export interface ApiResponseNoData {
  success: boolean;
  message: string | null; // messages?: string
  data: null;
  errors: string[] | null;// errors?: string[]
}