// src/types/user.ts
// Khớp 1:1 với ProfileUserDto + FollowDto (C#)

export interface ProfileUserDto {
  id: string;         // Guid
  name: string;       // Backend dùng Name, KHÔNG phải username
  avatarUrl: string;  // Backend trả về string, không phải null (có default)
  bio: string;        // Backend trả về string, có thể rỗng
}

export interface FollowDto {
  isFollow: boolean;
  isSuccess: boolean;
  message: string;
}