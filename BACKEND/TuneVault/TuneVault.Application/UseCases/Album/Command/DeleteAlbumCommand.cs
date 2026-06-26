using System;
using MediatR;

namespace TuneVault.Application.UseCases.Album.Command;

public class DeleteAlbumCommand:IRequest<bool>
{
    public Guid Id{get; set;}
    public DeleteAlbumCommand(Guid id)
    {
        Id=id;
    }

}
