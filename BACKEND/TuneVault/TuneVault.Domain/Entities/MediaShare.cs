using System;

namespace Domain.Entity;

public class MediaShare
{
    public Guid IdMediaShare { get; set; }//khoa chính
    public Guid IdSender { get; set; }//khoa ngoại, người chia sẻ
    public Guid IdReceiver { get; set; }//khoa ngoại, người nhận 
    public Guid? IdMediaItem { get; set; }//khoa ngoại, bài hát được chia sẻ
    public Guid? IdPlayList { get; set; }//khoa ngoại, playlist được chia sẻ
    public DateTime ShareAt { get; set; }=DateTime.UtcNow;//Ngay chia sẻ
}
