using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.DTOs;

public class SharedItemDto
{
    public Guid IdSender {get; set;}
    public DateTime ShareAt{get; set;}

    public ShareStyle ShareStyle{get; set;}
    public Guid IdItem{get; set;}
    public string? UrlImage{get; set;}
    public string Title{get; set;}


}
