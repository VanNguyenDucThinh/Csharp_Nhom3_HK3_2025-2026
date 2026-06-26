using System;

namespace TuneVault.Application.DTOs;

public class NameUserShareDto
{
    public Guid Id{get; set;}
    public string Name{get; set;}
    public string Email{get; set;}
    public string? UrlImage{get; set;}

}
