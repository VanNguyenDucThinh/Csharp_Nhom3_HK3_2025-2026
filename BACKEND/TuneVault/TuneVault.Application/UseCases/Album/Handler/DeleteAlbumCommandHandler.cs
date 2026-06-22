using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Album.Handler;

public class DeleteAlbumCommandHandler : IRequestHandler<DeleteAlbumCommand, bool>
{
    private readonly IAlbumRepository _album;
    private readonly ICurentUserService _curUser;

    public DeleteAlbumCommandHandler(IAlbumRepository album, ICurentUserService curUser)
    {
        _album = album;
        _curUser = curUser;
    }

    public async Task<bool> Handle(DeleteAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = await _album.GetAlbum(request.Id);

        if (album == null)
        {
            throw new Exception("Album không tồn tại hoặc đã bị xóa trước đó.");
        }

        if (album.Owner != _curUser.UserId)
        {
            throw new Exception("Bạn không có quyền xóa Album này.");
        }

        var isSuccess = await _album.DeleteAlbum(request.Id);

        if (!isSuccess)
        {
            throw new Exception("Xóa Album thất bại. Vui lòng thử lại sau!");
        }

        return true;
    }
}