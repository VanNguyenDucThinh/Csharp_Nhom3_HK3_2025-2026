using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Auth.Command;

public class RegisterCommand: IRequest<AuthResponseDto>
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public RegisterCommand(string name, string email, string password)
    {
        Name = name;
        Email = email;
        Password = password;
    }
}
