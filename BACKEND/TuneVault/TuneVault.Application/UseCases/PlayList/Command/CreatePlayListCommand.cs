using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.PlayList.Command;
[Authorize]
public class CreatePlayListCommand:IRequest<PlayListDto>
{
    public string Name {get; set;}
    public bool IsPublic {get; set;} 
    public Guid Owner {get;set;}

    public CreatePlayListCommand(string name, bool isPublic, Guid owner)
    {
        Name=name;
        IsPublic=isPublic;
        Owner=owner;

    }



}
