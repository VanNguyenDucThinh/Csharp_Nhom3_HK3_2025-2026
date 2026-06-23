using System;
using MediatR;

namespace TuneVault.Application.UseCases.Album.Command;

public class DeleteTrackAlbumCommand:IRequest<bool>
{
    public Guid IdAlbum{get; set;}
    public Guid IdMedia{get; set;}

    public DeleteTrackAlbumCommand(Guid idAlbum, Guid idMedia)
    {
        IdAlbum=idAlbum;
        IdMedia=idMedia;
    }

}
