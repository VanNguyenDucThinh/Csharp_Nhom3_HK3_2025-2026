using System;

namespace Domain.Entity;

public class PlayHistory
{
    public Guid IdPlayHistory { get; set; }//khoa chính
    public Guid IdUser { get; set; }//khoa ngoại, người nghe
    public Guid IdMediaItem { get; set; }//khoa ngoại, bài hát được nghe
    public DateTime PlayAt { get; set; }=DateTime.UtcNow;//Ngay nghe bai hat

}
