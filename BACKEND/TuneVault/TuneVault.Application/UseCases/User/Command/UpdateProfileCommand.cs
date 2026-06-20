using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Security;
namespace TuneVault.Application.UseCases.User.Command;

[Authorize]
public class UpdateProfileCommand: IRequest<ProfileUserDto>
{
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public string? FileName{get; set;}
    public string? ContentType{get; set;}
    public Stream? FileStream{get; set;}

    public UpdateProfileCommand(string? name, string? bio, string? fileName, string? contentType, Stream? fileStream)
    {
        Name = name;
        Bio = bio;
        FileName=fileName;
        ContentType=contentType;
        FileStream=fileStream;
    }

}
