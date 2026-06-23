using System;
using MediatR;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class RemoveTrackFromPlaylistCommandHandler:IRequestHandler<RemoveTrackFromPlaylistCommand, bool>
{
    private readonly IPlayListTrackRepository _playListTrack;
    private readonly IPlayListRepository _playList;
    private readonly ICurentUserService _curUser;

    public RemoveTrackFromPlaylistCommandHandler(IPlayListRepository playList,IPlayListTrackRepository playListTrack, ICurentUserService curUser)
    {
        _playListTrack=playListTrack;
        _curUser=curUser;
        _playList=playList;
    }

    public async Task<bool> Handle (RemoveTrackFromPlaylistCommand request, CancellationToken cancellationToken)
    {
        var playList = await _playList.GetPlayListById(request.IdPlayList);
        if(playList.Owner!=_curUser.UserId)
        {
            throw new UnauthorizedAccessException("Không thể xóa track của người khác");
        }
        await _playListTrack.RemoveTrackFromPlaylist(request.IdPlayList,request.IdTrack);
        return true;
    }

}
