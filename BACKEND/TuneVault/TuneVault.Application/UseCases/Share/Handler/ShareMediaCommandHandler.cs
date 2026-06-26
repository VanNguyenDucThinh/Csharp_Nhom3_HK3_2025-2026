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
    private readonly IPlayListRepository _playList;

    public ShareMediaCommandHandler(IMediaShareRepository mediaShare,ICurentUserService curUser, IMediator mediator,IMediaItemRepository media,IPlayListRepository playList)
    {
        _mediaShare=mediaShare;
        _curUser=curUser;
        _mediator=mediator;
        _media=media;
        _playList=playList;
    }

    public async Task<ShareMediaDto> Handle(ShareMediaCommand request, CancellationToken cancellationToken)
{
    if (_curUser.UserId == request.IdReceiver)
        throw new Exception("Không được tự chia sẻ");

    var ShareMediaNew = new MediaShare
    {
        IdSender = _curUser.UserId,
        IdReceiver = request.IdReceiver,
        ShareAt = DateTime.UtcNow // Đừng quên gán thời gian nhé
    };

    string message = "";

    // 1. Kiểm tra xem IdItem có thuộc về Media (Audio/Video) không
    var mediaItem = await _media.GetMediaItemById(request.IdItem);

    if (mediaItem != null)
    {
        // Là Media
        ShareMediaNew.IdMediaItem = request.IdItem;
        message = (mediaItem.MediaStyle == MediaStyle.Video) ? "Một Video" : "Một bài hát";
    }
    else
    {
        // 2. Nếu không phải Media, kiểm tra xem có phải Playlist không
        // Giả sử bạn có repository cho Playlist (hãy tiêm IPlayListRepository vào nếu cần)
        var playlist = await _playList.GetPlayListById(request.IdItem);
        
        if (playlist != null)
        {
            ShareMediaNew.IdPlayList = request.IdItem;
            message = "Một Playlist";
        }
        else
        {
            throw new Exception("Không tìm thấy tệp tin hoặc danh sách phát này!");
        }
    }

    var isSuccess = await _mediaShare.CreateMediaShare(ShareMediaNew);
    if (!isSuccess) throw new Exception("Tạo chia sẻ bị lỗi");

    // Tạo và ném sự kiện
    var shareEvent = new MediaSharedEvent(message, _curUser.UserId, request.IdReceiver, request.IdItem);
    await _mediator.Publish(shareEvent, cancellationToken);

    return new ShareMediaDto { IsSuccess = true, Notification = "Gửi thành công" };
}

}
