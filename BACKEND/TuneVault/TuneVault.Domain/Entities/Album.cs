using System;

namespace TuneVault.Domain.Entities;

public class Album
{
    public Guid Id{get; set;}
    public string? Name{get; set;}
    public string NameArtist{get; set;}
    public Guid Owner{get; set;}
    public string? UrlImage{get; set;}

}
