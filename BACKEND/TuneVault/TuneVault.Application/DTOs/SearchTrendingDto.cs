using System;

namespace TuneVault.Application.DTOs;

public class SearchTrendingDto
{
    public List<MediaDto>? ListMedia{get; set;}
    public List<PlayListDto>? ListPlayList{get; set;}
    public List<MediaDto>? ListMediaByArtist{get; set;}
    public List<AlbumDto>? ListAlbum{get; set;}
    public List<MediaDto>? ListTrending{get; set;}

    public int CurrentPage { get; set; }
    public int TotalResults { get; set; }

}
