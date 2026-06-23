using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Application.CreateException;
namespace TuneVault.Application.UseCases.Album.Handler;

public class GetAlbumCommandHandler : IRequestHandler<GetAlbumCommand, AlbumDto>
{
    private readonly IAlbumRepository _album;

    public GetAlbumCommandHandler(IAlbumRepository album)
    {
        _album = album;
    }

    public async Task<AlbumDto> Handle(GetAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = await _album.GetAlbum(request.Id);

        if (album == null)
        {
            throw new NotFoundException("Album không tồn tại.");
        }

        return new AlbumDto
        {
            Id = album.Id,
            Name = album.Name,
            NameArtist = album.NameArtist,
            UrlImage = album.UrlImage
        };
    }
}