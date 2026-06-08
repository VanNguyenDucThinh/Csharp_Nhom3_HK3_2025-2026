using System;

namespace TuneVault.Domain.Entities;

public class Favorite
{
    public Guid IdUser { get; set; }//khoa ngoại, người sở hữu danh sách yêu thích
    public Guid IdMediaItem { get; set; }//khoa ngoại, bài hát được yêu thích
    public DateTime FavoritedAt { get; set; }=DateTime.UtcNow;//Ngay them vao danh sach yeu thich

}
