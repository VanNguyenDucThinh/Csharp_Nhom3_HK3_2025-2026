using System;

namespace TuneVault.Application.DTOs;

public class VideoDto
{
    public string Title {get; set;}
    public Guid Artist {get; set;}
    public string? UrlImage {get; set;}
    public string? UrlMedia{get;set;}


}
