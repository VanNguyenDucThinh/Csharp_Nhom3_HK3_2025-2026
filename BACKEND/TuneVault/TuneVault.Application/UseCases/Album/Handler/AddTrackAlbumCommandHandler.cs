using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Application.CreateException;

namespace TuneVault.Application.UseCases.Album.Handler;

// Simple BadRequestException used by handlers when a request is invalid

public class AddTrackAlbumCommandHandler : IRequestHandler<AddTrackAlbumCommand, bool>
{
    private readonly IAlbumRepository _album;
    private readonly IMediaItemRepository _mediaItem;
    private readonly ITrackAlbumRepository _trackAlbum;
    private readonly ICurentUserService _curUser;

    public AddTrackAlbumCommandHandler(
        IAlbumRepository album, 
        IMediaItemRepository mediaItem, 
        ITrackAlbumRepository trackAlbum, 
        ICurentUserService curUser)
    {
        _album = album;
        _mediaItem = mediaItem;
        _trackAlbum = trackAlbum;
        _curUser = curUser;
    }

    public async Task<bool> Handle(AddTrackAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = await _album.GetAlbum(request.IdAlbum);
        var isTrack = await _album.CheckTrackAlbum(request.IdAlbum,request.IdMedia);

        if (album == null)
        {
            throw new NotFoundException("Album không tồn tại.");
        }

        if (album.Owner != _curUser.UserId)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền thêm nhạc vào Album này.");
        }

        var media = await _mediaItem.GetMediaItemById(request.IdMedia);

        if (media == null)
        {
            throw new NotFoundException("Bài hát không tồn tại.");
        }
        if (isTrack)
        {
            throw new BadRequestException("Bài hát này đã có sẵn trong Album.");
        }


        if (media.Owner != _curUser.UserId)
        {
            throw new UnauthorizedAccessException("Bạn chỉ được phép thêm nhạc do chính mình tải lên.");
        }

        var isSuccess = await _trackAlbum.AddTrackAlbum(request.IdAlbum, request.IdMedia);

        if (!isSuccess)
        {
            throw new Exception("Thêm bài hát vào Album thất bại. Vui lòng thử lại sau!");
        }

        return true;
    }
}