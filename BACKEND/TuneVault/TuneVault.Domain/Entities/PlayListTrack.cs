using System;

namespace TuneVault.Domain.Entities;

public class PlayListTrack//Lớp này đại diện cho mối quan hệ giữa PlayList và MediaItem, cho phép một PlayList có nhiều MediaItem và một MediaItem có thể thuộc về nhiều PlayList
{
    public Guid IdPlaylist { get; set; }//khoa ngoại đến PlayList
    public Guid IdMediaItem { get; set; }//khoa ngoại đến MediaItem
    public DateTime AddAt{ get; set; }//Ngay them bai hat vao playlist
}
