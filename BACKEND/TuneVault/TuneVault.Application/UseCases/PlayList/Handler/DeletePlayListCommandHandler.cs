using System;
using MediatR;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class DeletePlayListCommandHandler:IRequestHandler<DeletePlayListComman, bool>
{
    private readonly IPlayListRepository _playList;
    private readonly ICurentUserService _curUser;

    public DeletePlayListCommandHandler(IPlayListRepository playList, ICurentUserService curUser)
    {
        _playList=playList;
        _curUser=curUser;
    }
    public async Task<bool> Handle(DeletePlayListComman request, CancellationToken cancellationToken)
    {
        var playList = await _playList.GetPlayListById(request.IdPlaylist);
        if (playList.Owner != _curUser.UserId)
        {
            throw new UnauthorizedAccessException("Không được xóa của người khác");
        }
        await _playList.DeletePlayList(request.IdPlaylist);
        return true;
    }
    

}
