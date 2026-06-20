using System;
using MediatR;
using TuneVault.Application.UseCases.Notification.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Notification.Handler;

public class MarkAllNotificationsReadCommandHandler : IRequestHandler<MarkAllNotificationsReadCommand, bool>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly ICurentUserService _curUser;

    public MarkAllNotificationsReadCommandHandler(INotificationRepository notificationRepo, ICurentUserService curUser)
    {
        _notificationRepo = notificationRepo;
        _curUser = curUser;
    }

    public async Task<bool> Handle(MarkAllNotificationsReadCommand request, CancellationToken cancellationToken)
    {
        await _notificationRepo.MarkAllAsRead(_curUser.UserId);
        return true;
    }
}