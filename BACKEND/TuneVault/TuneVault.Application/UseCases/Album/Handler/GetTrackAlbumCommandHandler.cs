using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Application.CreateException;

namespace TuneVault.Application.UseCases.Album.Handler;

public class GetTrackAlbumCommandHandler : IRequestHandler<GetTrackAlbumCommand, AlbumDto>
{
    private readonly IAlbumRepository _album;
    private readonly ITrackAlbumRepository _track;
    private readonly IMediaItemRepository _mediaItem;

    public GetTrackAlbumCommandHandler(ITrackAlbumRepository track,IAlbumRepository album, IMediaItemRepository mediaItem)
    {
        _album = album;
        _mediaItem = mediaItem;
        _track=track;
    }

    public async Task<AlbumDto> Handle(GetTrackAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = await _album.GetAlbum(request.IdAlbum);

        if (album == null)
        {
            throw new NotFoundException("Album không tồn tại.");
        }
        var listTracks = await _track.GetMediaItemByAlbumId(request.IdAlbum);

        var listMediaDto = listTracks?.Select(track => new MediaDto
        {
            Id = track.Id,
            Title = track.Title,
            Artist = track.Artist,
            UrlImage=track.UrlImageMedia,
            Category=track.Category,
            Owner=track.Owner
        }).ToList();

        return new AlbumDto
        {
            Id = album.Id,
            Name = album.Name,
            NameArtist = album.NameArtist,
            UrlImage = album.UrlImage,
            ListMedia = listMediaDto
        };
    }
}