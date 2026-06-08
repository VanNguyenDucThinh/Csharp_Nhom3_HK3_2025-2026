using System;

namespace TuneVault.Domain.Entities;

public class MediaItem_Artist
{
    public Guid IdMediaItem { get; set; }//khoa ngoại, bài hát
    public Guid IdArtist { get; set; }//khoa ngoại, nghệ sĩ

}
