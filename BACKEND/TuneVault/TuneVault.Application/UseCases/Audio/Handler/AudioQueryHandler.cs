using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Audio.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;
using TuneVault.Application.CreateException;
namespace TuneVault.Application.UseCases.Audio.Handler;

public class AudioQueryHandler:IRequestHandler<AudioQuery,AudioMediaDto>
{
    private readonly IMediaItemRepository _mediaItem;
    private readonly IMediator _mediator;
    private readonly ICurentUserService _curUser;

    public AudioQueryHandler(IMediaItemRepository MediaItem,IMediator mediator,ICurentUserService curUser)
    {
        _mediaItem=MediaItem;
        _mediator=mediator;
        _curUser=curUser;
    }

    public async Task<AudioMediaDto> Handle (AudioQuery request,CancellationToken cancellationToken)
    {
        //Kiem tra có bài hát đó không
        var audio = await _mediaItem.GetAudioById(request.Id);
        if(audio==null)
        {
            throw new NotFoundException("Không có bài hát này");
        }
        await _mediator.Publish(new SaveHistoryEvent(_curUser.UserId,request.Id));

        //Lấy ra cho react
        return new AudioMediaDto
        {
            Title=audio.Title,
            Artist=audio.Artist,
            UrlImage=audio.UrlImageMedia,
            UrlMedia=audio.UrlMediaItem
        };

    }
}
