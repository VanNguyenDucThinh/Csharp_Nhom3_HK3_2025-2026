using System;
using MediatR;
using TuneVault.Domain.Enums;
using TuneVault.Application.DTOs;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.PlayList.Command;
[Authorize]
public class UpdatePlayListCommand:IRequest<bool>
{
    public Guid IdOwner{get; set;}
    public Guid IdPlayList{get; set;}
    public string? Name{get; set;}
    public PlayListStatus IsPublic{get;set;}
    public string? FileName{get; set;}
    public string? ContentType{get; set;}
    public Stream? FileStream{get; set;}

    public UpdatePlayListCommand(Guid idOwner, Guid idPlayList, string? name, PlayListStatus isPublic, string? fileName, string? contentType, Stream? fileStream)
    {
        IdOwner=idOwner;
        IdPlayList=idPlayList;
        Name=name;
        IsPublic=isPublic;
        FileName=fileName;
        ContentType=contentType;
        FileStream=fileStream;
    }

}
