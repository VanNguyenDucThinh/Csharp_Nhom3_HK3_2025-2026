using System;

namespace TuneVault.Application.DTOs;

public class AudioMediaDto
{
    public string Title {get; set;}
    public string Artist {get; set;}
    public string? UrlImage {get; set;}
    public string? UrlMedia{get;set;}
    public TimeSpan Duration{get; set;}
    public long ViewCount{get; set;}


}
