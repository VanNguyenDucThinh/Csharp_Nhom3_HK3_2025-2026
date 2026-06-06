using System;

namespace Domain.Entity;

public class PlayList
{
    public Guid IdPlaylist { get; set; }//khoa chính
    public string? NamePlaylist { get; set; }//Ten playlist
    public bool IsPublicPlaylist { get; set; }=true;//Playlist công khai hay riêng tư
    public DateTime CreatedDatePlaylist { get; set; }//Ngay tao playlist
    public Guid OwnerPlaylist { get; set; }//Nguoi tao playlist

}
