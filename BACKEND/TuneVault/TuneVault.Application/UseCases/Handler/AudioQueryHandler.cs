using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Query;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
namespace TuneVault.Application.UseCases.Handler;

public class AudioQueryHandler:IRequestHandler<AudioQuery,AudioMediaDto>
{
    private readonly IMediaItemRepository _mediaItem;
    private readonly IArtistRepository _artist;

    public AudioQueryHandler(IMediaItemRepository MediaItem,IArtistRepository Artist)
    {
        _mediaItem=MediaItem;
        _artist=Artist;
    }

    public async Task<AudioMediaDto> Handle (AudioQuery request,CancellationToken cancellationToken)
    {
        //Kiem tra có bài hát đó không
        var audio = await _mediaItem.GetMediaItemById(request.Id);
        if(audio==null)
        {
            throw new Exception("Không có bài hát này");
        }
        var artist=await _artist.GetArtistById(audio.Owner);
        //Lấy ra cho react
        return new AudioMediaDto
        {
            Title=audio.Title,
            Artist=artist.NameArtist,
            UrlImage=audio.UrlImageMedia,
            UrlMedia=audio.UrlMediaItem,
            ViewCount=audio.ViewCount,
            Duration=audio.Duration
        };

    }
}
