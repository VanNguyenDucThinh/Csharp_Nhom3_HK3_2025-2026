using System;

namespace TuneVault.Application.DTOs;

public class SearchDto
{
    public List<MediaDto> ListMedia{get;set;}
    public List<MediaDto> ListMediaByArtist{get; set;}
    public List<PlayListDto> ListPlaylist{get; set;}

    public List<MediaDto> Trending{get; set;}

    public int CurrentPage { get; set; }
    public int TotalResults { get; set; }


}
