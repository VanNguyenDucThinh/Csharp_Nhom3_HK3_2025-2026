using System;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.NotificationUser.Command;
using TuneVault.Domain.Interfaces;
using MediatR;

namespace TuneVault.Application.UseCases.NotificationUser.Handler;

public class GetNotificationQueryHandler:IRequestHandler<GetNotificationQuery, List<NotificationDto>>
{
    private readonly INotificationRepository _notification;
    private readonly ICurentUserService _curUser;

    public GetNotificationQueryHandler(INotificationRepository notification, ICurentUserService curUser)
    {
        _notification=notification;
        _curUser=curUser;
    }

    public async Task<List<NotificationDto>> Handle(GetNotificationQuery request, CancellationToken cancellationToken)
    {
        var listNotification = await _notification.GetNotifications(_curUser.UserId);

        var result = listNotification.Select(x=> new NotificationDto
        {
            Id=x.Id,
            IsRead=x.IsRead,
            payload=x.Payload
        }).ToList();
        return result;
    }

}
