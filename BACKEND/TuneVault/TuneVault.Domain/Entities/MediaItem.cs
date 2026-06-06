using System;
using TuneVault.Domain.Enums;

namespace Domain.Entity;

public class MediaItem
{
    public Guid IdMediaItem { get; set; }//khóa chính 
    public string? TitleMediaItem { get; set; }//Ten bai hat
    public TimeSpan DurationMediaItem { get; set; }//Thoi luong bai hat
    public MediaStyle MediaStyleMediaItem { get; set; }// Loai video hay nhac
    public string UrlMediaItem { get; set; }//Duong dan den file media
    public Guid OwnerMediaItem { get; set; }//Nguoi tai len
    public DateTime UploadDateMediaItem { get; set; }=DateTime.UtcNow;//Ngay tai len


}
