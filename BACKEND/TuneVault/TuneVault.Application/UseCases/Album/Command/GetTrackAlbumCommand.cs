using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Album.Command;

public class GetTrackAlbumCommand : IRequest<AlbumDto>
{
    public Guid IdAlbum { get; set; }

    public GetTrackAlbumCommand(Guid idAlbum)
    {
        IdAlbum = idAlbum;
    }
}