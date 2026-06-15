using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Command;

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
