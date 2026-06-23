using System;

namespace TuneVault.Application.DTOs;

public class ProfileUserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string AvatarUrl { get; set; }
    public string Bio { get; set; }

}
