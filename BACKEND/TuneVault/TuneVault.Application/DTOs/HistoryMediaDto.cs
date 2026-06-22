using System;

namespace TuneVault.Application.DTOs;

public class HistoryMediaDto
{
    public Guid IdMedia{get; set;}
    public string UrlImage{get; set;}
    public string Title{get; set;}
    public string Artist{get; set;}
    public DateTime PlayAt{get; set;}

}
