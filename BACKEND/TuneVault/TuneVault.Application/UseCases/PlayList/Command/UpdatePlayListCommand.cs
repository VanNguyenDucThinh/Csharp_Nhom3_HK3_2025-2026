using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.PlayList.Command;
[Authorize]
public class UpdatePlayListCommand:IRequest<PlayListDto>
{
    public Guid IdOwner{get; set;}
    public Guid IdPlayList{get; set;}
    public string? Name{get; set;}
    public bool IsPublic{get;set;}
    public string? UrlImage{get; set;}

    public UpdatePlayListCommand(Guid idOwner, Guid idPlayList, string? name, bool isPublic, string? urlImage)
    {
        IdOwner=idOwner;
        IdPlayList=idPlayList;
        Name=name;
        IsPublic=isPublic;
        UrlImage=urlImage;
    }

}
