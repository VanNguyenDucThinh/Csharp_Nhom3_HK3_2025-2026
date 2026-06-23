using System;

namespace TuneVault.Application.DTOs;

public class AlbumDto
{
    public Guid Id{get; set;}
    public string Name{get; set;}
    public string NameArtist{get; set;}
    public string? UrlImage{get; set;}
    public List<MediaDto>? ListMedia{get; set;}
}
