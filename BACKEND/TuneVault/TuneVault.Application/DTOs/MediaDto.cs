using System;

namespace TuneVault.Application.DTOs;

public class MediaDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public TimeSpan Duration { get; set; }
    public Guid Owner { get; set; }


}
