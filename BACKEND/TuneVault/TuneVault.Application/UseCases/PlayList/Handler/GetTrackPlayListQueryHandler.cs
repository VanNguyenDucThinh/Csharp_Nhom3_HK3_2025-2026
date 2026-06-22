using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class GetTrackPlayListQueryHandler:IRequestHandler<GetTrackPlayListQuery, PlayListDto>
{
    private readonly IPlayListTrackRepository _track;
    private readonly IPlayListRepository _playList;
    private readonly IMediaItemRepository _media;

    public GetTrackPlayListQueryHandler(IPlayListTrackRepository track, IPlayListRepository playList, IMediaItemRepository media)
    {
        _track=track;
        _playList=playList;
        _media=media;
    }

    public async Task<PlayListDto> Handle(GetTrackPlayListQuery request, CancellationToken cancellationToken)
    {
        var playListInfo = await _playList.GetPlayListById(request.IdPlayList);
        var trackPL=await _track.GetTracksInPlaylist(request.IdPlayList);
        var trackList= trackPL.Select(x=>new MediaDto
        {
            Id=x.Id,
            Artist=x.Artist,
            Title=x.Title,
            Owner=x.Owner,
            UrlImage=x.UrlImageMedia
        }).ToList();

        return new PlayListDto
        {
            Id=playListInfo.Id,
            Name=playListInfo.Name,
            Owner=playListInfo.Owner,
            Track=trackList
        };
        
    }

}
