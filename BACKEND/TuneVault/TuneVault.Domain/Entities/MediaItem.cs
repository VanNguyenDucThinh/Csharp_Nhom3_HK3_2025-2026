using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Domain.Entities;

public class MediaItem
{
    public Guid Id { get; set; }//khóa chính 
    public string? Title { get; set; }//Ten bai hat
    public string? Description { get; set; }//Mo ta bai hat
    public Category Category { get; set; }//The loai bai hat
    public TimeSpan Duration { get; set; }//Thoi luong bai hat
    public MediaStyle MediaStyle { get; set; }// Loai video hay nhac
    public string? UrlImageMedia {get;set;}//Ảnh của file audio
    public long ViewCount {get;set;}//Lượt nghe
    public string? UrlMediaItem { get; set; }//Duong dan den file media
    public Guid Owner { get; set; }//Nguoi tai len
    public DateTime UploadDateMediaItem { get; set; }=DateTime.UtcNow;//Ngay tai len


}
