using System;
using MediatR;

namespace TuneVault.Application.UseCases.Album.Command;

public class UpdateAlbumCommand:IRequest<bool>
{
    public Guid Id{get; set;}
    public string Name{get; set;}
    public string NameArtist{get; set;}
    public string? ImageFileName{get; set;}
    public string? ImageContentType{get; set;}
    public Stream? ImageFileStream{get; set;}
    public UpdateAlbumCommand(Guid id,string name, string nameArtist, string?imageFileName, string? imageContentType, Stream? imageFileStream)
    {
        ImageFileName=imageFileName;
        ImageContentType=imageContentType;
        ImageFileStream=imageFileStream;
        Name=name;
        NameArtist=nameArtist;
        Id=id;
    }

}
