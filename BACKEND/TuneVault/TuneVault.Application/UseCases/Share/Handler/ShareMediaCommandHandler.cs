using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Share.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;
using TuneVault.Domain.Events;

namespace TuneVault.Application.UseCases.Share.Handler;

public class ShareMediaCommandHandler:IRequestHandler<ShareMediaCommand,ShareMediaDto>
{
    private readonly IMediaShareRepository _mediaShare;
    private readonly ICurentUserService _curUser;
    private readonly IMediator _mediator;

    public ShareMediaCommandHandler(IMediaShareRepository mediaShare,ICurentUserService curUser, IMediator mediator)
    {
        _mediaShare=mediaShare;
        _curUser=curUser;
        _mediator=mediator;
    }

    public async Task<ShareMediaDto> Handle (ShareMediaCommand request, CancellationToken cancellationToken)
    {
        if (_curUser.UserId == request.IdReceiver)
        {
            throw new Exception("Không được tự chia sẽ");
        }
        //Tạo 1 sharemedia mới
        var ShareMediaNew = new MediaShare
        {
            IdSender=_curUser.UserId,
            IdReceiver=request.IdReceiver,
            

        };
        if(request.ShareStyle==ShareStyle.Media)
        {
            ShareMediaNew.IdMediaItem=request.IdItem;
        }else if(request.ShareStyle==ShareStyle.Playlist){
            ShareMediaNew.IdPlayList=request.IdItem;
        }
        await _mediaShare.CreateMediaShare(ShareMediaNew);
        //tạo sự kiện
        var shareEvent = new MediaSharedEvent
        (
            request.ShareStyle==ShareStyle.Media ? "Một bài hát":"Một Playlist",
            _curUser.UserId,
            request.IdReceiver,
            request.IdItem
        );
        //ném thư 
        await _mediator.Publish(shareEvent, cancellationToken);
        return new ShareMediaDto
        {
          IsSuccess=true,
          Notification="Gửi thành công"  
        };

    }

}
