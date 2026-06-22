using System;
using MediatR;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.UseCases.HistoryMedia.Handler;

public class SaveHistoryEventHandler:INotificationHandler<SaveHistoryEvent>
{
 private readonly IPlayHistoryRepository _playHistory;
 private readonly IMediaItemRepository _mediaItem;
    private readonly ICurentUserService _curUser;

    public SaveHistoryEventHandler(IMediaItemRepository mediaItem,IPlayHistoryRepository playHistory,ICurentUserService curUser)
    {
        _playHistory=playHistory;
        _curUser=curUser;
        _mediaItem=mediaItem;
    }

    public async Task Handle (SaveHistoryEvent notification, CancellationToken cancellationToken)
    {
        var newMediaHistory = new PlayHistory
        {
            IdUser=_curUser.UserId,
            IdMediaItem=notification.IdMediaItem,
            PlayAt=DateTime.UtcNow
        };
        await _mediaItem.CountView(notification.IdMediaItem);
        await _playHistory.AddMediaPlayHistory(newMediaHistory);
    }
}
