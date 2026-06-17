using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.HistoryMedia.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.HistoryMedia.Handler;

public class GetHistoryQueryHandler:IRequestHandler<GetHistoryQuery, List<HistoryMediaDto>>
{
    private readonly IPlayHistoryRepository _playHistory;
    private readonly ICurentUserService _curUser;

    public GetHistoryQueryHandler(IPlayHistoryRepository playHistory, ICurentUserService curUser)
    {
        _playHistory=playHistory;
        _curUser=curUser;
    }
    public async Task<List<HistoryMediaDto>> Handle (GetHistoryQuery request, CancellationToken cancellationToken)
    {
        var listHistory = await _playHistory.GetPlayHistoryByUserId(_curUser.UserId);
        return listHistory.Select(x=>new HistoryMediaDto
        {
            IdMedia=x.IdMediaItem,
            PlayAt=x.PlayAt
            
        }).ToList();

    }

}
