// src/types/auth.ts
// Khớp 1:1 với AuthController + AuthResponseDto (C#)
// MỤC ĐÍCH: Định nghĩa dữ liệu liên quan tới Đăng nhập / Đăng ký.
// Tương ứng Controller "Auth" trong backend.

// Request gửi lên backend
/*
 * Dữ liệu mà FRONTEND cần GỬI LÊN khi gọi API "Đăng nhập".
 * Endpoint: POST /api/auth/login
 */
export interface LoginRequest {
  email: string;      // Backend dùng Email, KHÔNG phải username
  password: string;
}

/*
 * Dữ liệu mà FRONTEND cần GỬI LÊN khi gọi API "Đăng ký".
 * Endpoint: POST /api/auth/register
 *
 * Đặt tên là "Request" (không phải DTO) để phân biệt rõ:
 * đây là dữ liệu ta GỬI ĐI, không phải dữ liệu ta NHẬN VỀ.
 */
export interface RegisterRequest {
  name: string;       // Backend dùng Name, không có username
  email: string;
  password: string;   // MinLength 8 theo backend validator
}

// Response nhận từ backend (ApiResponse<AuthResponseDto>)
// Backend trả về dạng PHẲNG: { Id, Name, Email, Token } — KHÔNG có object user bọc trong
/*
 * Dữ liệu mà BACKEND TRẢ VỀ sau khi đăng nhập/đăng ký thành công.
 * Đây chính là "ruột" (T) sẽ điền vào ApiResponse<T>.
 *
 * Ví dụ dùng thực tế: ApiResponse<AuthResponseDto>
 *
 * Lưu ý: bên C# field "id" là kiểu Guid. Ở TypeScript không có kiểu Guid,
 * nên ta dùng "string" để biểu diễn (Guid lúc serialize qua JSON
 * vốn cũng chỉ là 1 chuỗi dạng "xxxxxxxx-xxxx-xxxx-..." mà thôi).
 */
export interface AuthResponseDto {
  id: string;         // Guid C# → string trong TypeScript
  name: string;
  email: string;

  // token: chuỗi JWT, frontend phải LƯU LẠI chuỗi này
  // (ví dụ vào localStorage) để gửi kèm header Authorization
  // cho các API cần đăng nhập (Auth = Yes) ở những bước sau.
  token: string;
}