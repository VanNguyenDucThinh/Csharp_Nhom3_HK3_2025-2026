using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class GetPlayListQueryCommand:IRequestHandler<GetPlayListQuery, PlayListDto>
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

    public async Task<PlayListDto> Handle (GetPlayListQuery request, CancellationToken cancellationToken)
    {
        var playList = await _playList.GetPlayListById(request.IdPlayList);
        if (!playList.IsPublic && playList.Owner != _curUser.UserId)
        {
            throw new UnauthorizedAccessException("Không được được vào riêng tư");
        }
        var playListTrack =await _playListTrack.GetTracksInPlaylist(request.IdPlayList);

        return new PlayListDto
        {
            Id=request.IdPlayList,
            IsPublic=playList.IsPublic,
            Name=playList.Name,
            Owner=playList.Owner,
            UrlImage=playList.UrlPlayList,
            Track=playListTrack.Select(x=>new MediaDto
            {
                Id=x.Id,
                Category=x.Category,
                Owner=x.Owner,
                Title=x.Title,
                UrlImage=x.UrlImageMedia,
                UrlMedia=x.UrlMediaItem
            }).ToList()
        };
    }

}
