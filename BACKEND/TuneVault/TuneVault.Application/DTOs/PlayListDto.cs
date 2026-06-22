using System;

namespace TuneVault.Application.DTOs;

public class PlayListDto
{
    public Guid Id{get;set;}
    public string? Name{get; set;}
    public string? UrlImage{get; set;}
    public Guid Owner {get; set;}

    public List<MediaDto> Track{get; set;}

}
