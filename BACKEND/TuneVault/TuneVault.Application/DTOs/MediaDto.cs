using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.DTOs;

public class MediaDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string UrlMedia{get; set;}
    public Category Category{get; set;}
    public Guid Owner { get; set; }




}
