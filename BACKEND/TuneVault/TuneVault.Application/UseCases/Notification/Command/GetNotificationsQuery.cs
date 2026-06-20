using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Notification.Command;

public class GetNotificationsQuery : IRequest<List<NotificationDto>>
{
    public bool OnlyUnread { get; set; }

    public GetNotificationsQuery(bool onlyUnread = false)
    {
        OnlyUnread = onlyUnread;
    }
}