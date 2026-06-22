using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Album.Handler;

public class DeleteTrackAlbumCommandHandler : IRequestHandler<DeleteTrackAlbumCommand, bool>
{
    private readonly IAlbumRepository _album;
    private readonly ITrackAlbumRepository _trackAlbum;
    private readonly ICurentUserService _curUser;

    public DeleteTrackAlbumCommandHandler(
        IAlbumRepository album, 
        ITrackAlbumRepository trackAlbum, 
        ICurentUserService curUser)
    {
        _album = album;
        _trackAlbum = trackAlbum;
        _curUser = curUser;
    }

    public async Task<bool> Handle(DeleteTrackAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = await _album.GetAlbum(request.IdAlbum);

        if (album == null)
        {
            throw new Exception("Album không tồn tại.");
        }

        if (album.Owner != _curUser.UserId)
        {
            throw new Exception("Bạn không có quyền xóa nhạc khỏi Album này.");
        }

        var isSuccess = await _trackAlbum.DeleteTrackAlbum(request.IdAlbum, request.IdMedia);

        if (!isSuccess)
        {
            throw new Exception("Xóa bài hát khỏi Album thất bại. Vui lòng thử lại sau!");
        }

        return true;
    }
}