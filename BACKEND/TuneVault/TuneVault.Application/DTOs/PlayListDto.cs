using System;

namespace TuneVault.Application.DTOs;

public class PlayListDto
{
    public Guid Id {get; set;}
    public string? Name{get; set;}
    public bool IsPublic{get; set;}
    public Guid Owner{get; set;}

}
