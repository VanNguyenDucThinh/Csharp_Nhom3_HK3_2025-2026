using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Command;

public class RegisterCommand: IRequest<AuthResponseDto>
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime DateOfBirth { get; set; } 

    public RegisterCommand(string name, string email, string password, DateTime dateOfBirth)
    {
        Name = name;
        Email = email;
        Password = password;
        DateOfBirth = dateOfBirth;
    }
}
