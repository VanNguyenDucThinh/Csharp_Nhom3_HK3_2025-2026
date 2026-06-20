using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Enums;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.PlayList.Command;
[Authorize]
public class CreatePlayListCommand:IRequest<PlayListDto>
{
    public string Name {get; set;}
    public PlayListStatus IsPublic {get; set;} 
    public Guid Owner {get;set;}

    public string? ImageFileName{get; set;}
    public string? ImageContentType{get; set;}
    public Stream? ImageFileStream{get; set;}


    public CreatePlayListCommand(string name, PlayListStatus isPublic, Guid owner, string? imageFileName, string? imageContentType, Stream? imageFileStream)
    {
        Name=name;
        IsPublic=isPublic;
        Owner=owner;
        ImageFileName=imageFileName;
        ImageContentType=imageContentType;
        ImageFileStream=imageFileStream;
    }



}
