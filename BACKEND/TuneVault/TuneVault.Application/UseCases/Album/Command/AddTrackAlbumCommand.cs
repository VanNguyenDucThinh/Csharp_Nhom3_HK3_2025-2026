using System;
using MediatR;

namespace TuneVault.Application.UseCases.Album.Command;

public class AddTrackAlbumCommand:IRequest<bool>
{
    public Guid IdAlbum{get; set;}
    public Guid IdMedia{get; set;}
    public AddTrackAlbumCommand(Guid idAlbum, Guid idMedia)
    {
        IdAlbum=idAlbum;
        IdMedia=idMedia;
    }

}
