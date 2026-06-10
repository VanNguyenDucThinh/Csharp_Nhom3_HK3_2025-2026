using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Domain.Entities;

public class UserProfile
{
    public Guid Id { get; set; }//Khóa chính
    public string? Name { get; set; }//Tên người dùng
    public string? Email { get; set; }//Email người dùng
    public string? AvatarUrl { get; set; }//URL ảnh đại diện người dùng
    public string? Bio { get; set; }//Tiểu sử người dùng
    public string Password { get; set; }//Mật khẩu người dùng

}
