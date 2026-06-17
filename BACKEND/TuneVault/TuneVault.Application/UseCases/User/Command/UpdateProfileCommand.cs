using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Security;
namespace TuneVault.Application.UseCases.User.Command;

[Authorize]
public class UpdateProfileCommand: IRequest<ProfileUserDto>
{
    public string Name { get; set; }
    public string AvatarUrl { get; set; }
    public string Bio { get; set; }

    public UpdateProfileCommand(string name, string avatarUrl, string bio)
    {
        Name = name;
        AvatarUrl = avatarUrl;
        Bio = bio;
    }

}
