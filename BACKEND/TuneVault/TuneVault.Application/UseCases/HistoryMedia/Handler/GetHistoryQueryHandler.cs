using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.HistoryMedia.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.HistoryMedia.Handler;

public class GetHistoryQueryHandler:IRequestHandler<GetHistoryQuery, List<HistoryMediaDto>>
{
    private readonly IPlayHistoryRepository _playHistory;
    private readonly IMediaItemRepository _media;
    private readonly ICurentUserService _curUser;

    public GetHistoryQueryHandler(IPlayHistoryRepository playHistory, ICurentUserService curUser, IMediaItemRepository media)
    {
        _playHistory=playHistory;
        _curUser=curUser;
        _media=media;
    }
    public async Task<List<HistoryMediaDto>> Handle (GetHistoryQuery request, CancellationToken cancellationToken)
    {
        var listHistory = await _playHistory.GetPlayHistoryByUserId(_curUser.UserId);
        var result = new List<HistoryMediaDto>();
        foreach(var history in listHistory)
        {
            var mediaItem = await _media.GetMediaItemById(history.IdMediaItem);
            result.Add(new HistoryMediaDto
            {
                IdMedia=history.IdMediaItem,
                UrlImage=mediaItem.UrlImageMedia,
                Artist=mediaItem.Artist,
                PlayAt=history.PlayAt,
                Title=mediaItem.Title
            });
        }
        return result;

    }

}
