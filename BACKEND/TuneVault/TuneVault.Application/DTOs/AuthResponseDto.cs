using System;

namespace TuneVault.Application.DTOs;

public class AuthResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Token { get; set; }

}
