using System;

namespace TuneVault.Domain.Entities;

public class MediaShare
{
    public Guid IdSender { get; set; }//khoa ngoại, người chia sẻ
    public Guid IdReceiver { get; set; }//khoa ngoại, người nhận 
    public Guid? IdMediaItem { get; set; }//khoa ngoại, bài hát được chia sẻ
    public MediaItem? MediaItem{get; set;}
    public Guid? IdPlayList { get; set; }//khoa ngoại, playlist được chia sẻ
    public PlayListEntities? PlayList{get; set;}
    public DateTime ShareAt { get; set; }=DateTime.UtcNow;//Ngay chia sẻ
}
