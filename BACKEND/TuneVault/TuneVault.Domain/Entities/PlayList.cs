using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Domain.Entities;

public class PlayListEntities
{
    public Guid Id { get; set; }//khoa chính
    public string? Name { get; set; }//Ten playlist
    public string? UrlImage{get; set;}
    public PlayListStatus IsPublic { get; set; }//Playlist công khai(true) hay riêng tư(false)
    public DateTime CreatedDate { get; set; }//Ngay tao playlist
    public Guid Owner { get; set; }//Nguoi tao playlist

}
