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
    private readonly IMediaItemRepository _media;
    private readonly ICurentUserService _curUser;
    private readonly IMediator _mediator;

    public ShareMediaCommandHandler(IMediaShareRepository mediaShare,ICurentUserService curUser, IMediator mediator,IMediaItemRepository media)
    {
        _mediaShare=mediaShare;
        _curUser=curUser;
        _mediator=mediator;
        _media=media;
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
            IdReceiver=request.IdReceiver 
        };
        string message="";
        var styleMedia = await _media.GetMediaItemById(request.IdItem);

        if(request.ShareStyle==ShareStyle.Media)
        {
            if (styleMedia == null) throw new Exception("Không tìm thấy tệp tin media này!");
            ShareMediaNew.IdMediaItem=request.IdItem;
            message = (styleMedia.MediaStyle == MediaStyle.Video) ? "Một Video" : "Một bài hát";
        }else if(request.ShareStyle==ShareStyle.Playlist){
            ShareMediaNew.IdPlayList=request.IdItem;
            message = "Một Playlist";
        }
        await _mediaShare.CreateMediaShare(ShareMediaNew);
        //tạo sự kiện
        var shareEvent = new MediaSharedEvent
        (
            message,
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
