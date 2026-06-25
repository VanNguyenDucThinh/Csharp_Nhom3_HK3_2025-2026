using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Video.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Events;

namespace TuneVault.Application.UseCases.Video.Handler;

public class GetVideoQueryHandler:IRequestHandler<GetVideoQuery, VideoDto>
{
    private readonly IMediaItemRepository _mediaItem;
    private readonly ICurentUserService _curUser;
    private readonly IMediator _mediator;

    public GetVideoQueryHandler(IMediaItemRepository mediaItem,IMediator mediator,ICurentUserService curUser)
    {
        _mediaItem=mediaItem;
        _mediator=mediator;
        _curUser=curUser;
    }
    public async Task<VideoDto> Handle(GetVideoQuery request, CancellationToken cancellationToken)
    {
        
        var mediaVideo = await _mediaItem.GetVideoById(request.IdVideo);
        if (mediaVideo == null)
        {
            throw new Exception("Không tìm thấy video này!"); 
        }


        await _mediator.Publish(new SaveHistoryEvent(_curUser.UserId,request.IdVideo),cancellationToken);
        return new VideoDto
        {
            Title=mediaVideo.Title,
            Artist=mediaVideo.Artist,
            UrlImage=mediaVideo.UrlImageMedia,
            UrlMedia=mediaVideo.UrlMediaItem,
            Id=mediaVideo.Id
        };
    }
}
