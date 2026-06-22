// src/types/auth.ts
// Khớp 1:1 với AuthController + AuthResponseDto (C#)

// Request gửi lên backend
export interface LoginRequest {
  email: string;      // Backend dùng Email, KHÔNG phải username
  password: string;
}

export interface RegisterRequest {
  name: string;       // Backend dùng Name, không có username
  email: string;
  password: string;   // MinLength 8 theo backend validator
}

// Response nhận từ backend (ApiResponse<AuthResponseDto>)
// Backend trả về dạng PHẲNG: { Id, Name, Email, Token } — KHÔNG có object user bọc trong
export interface AuthResponse {
  id: string;         // Guid C# → string trong TS
  name: string;
  email: string;
  token: string;
}