using System;

namespace TuneVault.Application.DTOs;

public class AudioMediaDto
{
    public string Title {get; set;}
    public Guid Artist {get; set;}
    public string? UrlImage {get; set;}
    public string? UrlMedia{get;set;}


}
