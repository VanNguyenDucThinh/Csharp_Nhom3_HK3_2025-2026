using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class GetPlayListQueryCommand:IRequestHandler<GetPlayListQuery,List<PlayListDto>>
{
    private readonly IPlayListRepository _playList;
    private readonly IPlayListTrackRepository _playListTrack;
    private readonly ICurentUserService _curUser;

    public GetPlayListQueryCommand(ICurentUserService curUser, IPlayListRepository playList, IPlayListTrackRepository playListTrack)
    {
        _playList=playList;
        _playListTrack=playListTrack;
        _curUser=curUser;
    }

    public async Task<List<PlayListDto>> Handle (GetPlayListQuery request, CancellationToken cancellationToken)
    {
        var playList = await _playList.GetPlayListForMe(_curUser.UserId);

        var result = playList.Select(x=>new PlayListDto
        {
            Id=x.Id,
            Name=x.Name,
            Owner=x.Owner,
            UrlImage=x.UrlImage
        }).ToList();

        return result;

    }

}
