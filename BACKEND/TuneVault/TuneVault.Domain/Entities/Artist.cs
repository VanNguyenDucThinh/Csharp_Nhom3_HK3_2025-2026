using System;

namespace TuneVault.Domain.Entities;

public class Artist
{
    public Guid Id { get; set; }//Khóa chính
    public Guid IdUserProfile { get; set; }//khoa ngoại, liên kết với UserProfile
    public string? NameArtist { get; set; }//Biệt danh nghệ sĩ
    public bool IsVerified { get; set; }=false;//Xác định nếu nghệ sĩ nên có tích xanh


}
