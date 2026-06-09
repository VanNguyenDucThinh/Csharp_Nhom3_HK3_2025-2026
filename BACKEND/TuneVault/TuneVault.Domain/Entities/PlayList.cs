using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Domain.Entities;

public class PlayList
{
    public Guid Id { get; set; }//khoa chính
    public string? Name { get; set; }//Ten playlist
    public bool IsPublic { get; set; }=true;//Playlist công khai(true) hay riêng tư(false)
    public DateTime CreatedDate { get; set; }= DateTime.UtcNow;//Ngay tao playlist
    public Guid Owner { get; set; } //Nguoi tao playlist, khoa ngoai

}
