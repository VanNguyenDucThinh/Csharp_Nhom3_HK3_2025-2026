using System;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.NotificationUser.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Enums;
using MediatR;

namespace TuneVault.Application.UseCases.NotificationUser.Handler;

public class MaskAsReadQueryHandler:IRequestHandler<MaskAsReadQuery, bool>
{
    private readonly INotificationRepository _notification;
    private readonly ICurentUserService _curUser;

    public MaskAsReadQueryHandler(INotificationRepository notification, ICurentUserService curUser)
    {
        _notification=notification;
        _curUser=curUser;
    }
    public async Task<bool> Handle (MaskAsReadQuery request, CancellationToken cancellationToken)
    {
        var isRead = Read.Read;
        var updateNotification = await _notification.UpdateNotification(_curUser.UserId,request.IdNotification, (int)isRead);
        return true;

    }

}
