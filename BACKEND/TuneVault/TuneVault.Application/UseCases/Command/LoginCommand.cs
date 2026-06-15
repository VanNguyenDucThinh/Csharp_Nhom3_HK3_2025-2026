using System;
using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Command;

public class LoginCommand: IRequest<AuthResponseDto>
{
    public string Email { get; set; }
    public string Password { get; set; }

    public LoginCommand(string email, string password)
    {
        Email = email;
        Password = password;
    }

}
