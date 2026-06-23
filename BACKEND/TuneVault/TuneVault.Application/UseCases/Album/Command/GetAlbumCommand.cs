using System;
using TuneVault.Application.DTOs;
using MediatR;
namespace TuneVault.Application.UseCases.Album.Command;

public class GetAlbumCommand:IRequest<AlbumDto>
{
    public Guid Id{get; set;}
    public GetAlbumCommand(Guid id)
    {
        Id=id;
    }

}
