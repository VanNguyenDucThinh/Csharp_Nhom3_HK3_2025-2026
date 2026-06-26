using System;
using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Album.Command;

public class CreateAlbumCommand:IRequest<AlbumDto>
{
    public string Name{get; set;}
    public string NameArtist{get; set;}
    public string? ImageFileName{get; set;}
    public string? ImageContentType{get; set;}
    public Stream? ImageFileStream{get; set;}
    public CreateAlbumCommand(string name, string nameArtist, string?imageFileName, string? imageContentType, Stream? imageFileStream)
    {
        ImageFileName=imageFileName;
        ImageContentType=imageContentType;
        ImageFileStream=imageFileStream;
        Name=name;
        NameArtist=nameArtist;
    }

}
