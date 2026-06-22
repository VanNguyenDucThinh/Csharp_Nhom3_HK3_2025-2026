using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Album.Handler;

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

        if (album == null)
        {
            throw new Exception("Album không tồn tại.");
        }

        if (album.Owner != _curUser.UserId)
        {
            throw new Exception("Bạn không có quyền thêm nhạc vào Album này.");
        }

        var media = await _mediaItem.GetMediaItemById(request.IdMedia);

        if (media == null)
        {
            throw new Exception("Bài hát không tồn tại.");
        }

        if (media.Owner != _curUser.UserId)
        {
            throw new Exception("Bạn chỉ được phép thêm nhạc do chính mình tải lên.");
        }

        var isSuccess = await _trackAlbum.AddTrackAlbum(request.IdAlbum, request.IdMedia);

        if (!isSuccess)
        {
            throw new Exception("Thêm bài hát vào Album thất bại. Vui lòng thử lại sau!");
        }

        return true;
    }
}