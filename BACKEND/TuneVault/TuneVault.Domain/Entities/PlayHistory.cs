using System;

namespace TuneVault.Domain.Entities;

public class PlayHistory
{
    public Guid IdUser { get; set; }//khoa ngoại, người nghe
    public Guid IdMediaItem { get; set; }//khoa ngoại, bài hát được nghe
    public DateTime PlayAt { get; set; }=DateTime.UtcNow;//Ngay nghe bai hat

}
