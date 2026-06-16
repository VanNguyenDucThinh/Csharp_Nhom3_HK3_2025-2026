using System;

namespace TuneVault.Application.DTOs;

public class SearchTrendingDto
{
    public List<MediaDto> ListMedia{get; set;}
    public List<PlayListDto> ListPlayList{get; set;}
    public List<MediaDto> Trending{get; set;}

}
