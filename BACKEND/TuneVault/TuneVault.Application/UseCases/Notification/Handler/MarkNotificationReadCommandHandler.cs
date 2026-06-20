using System;
using MediatR;
using TuneVault.Application.UseCases.Notification.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Notification.Handler;

public class MarkNotificationReadCommandHandler : IRequestHandler<MarkNotificationReadCommand, bool>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly ICurentUserService _curUser;

    public MarkNotificationReadCommandHandler(INotificationRepository notificationRepo, ICurentUserService curUser)
    {
        _notificationRepo = notificationRepo;
        _curUser = curUser;
    }

    public async Task<bool> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
    {
        var notification = await _notificationRepo.GetNotificationById(request.IdNotification);
        if (notification == null)
        {
            throw new Exception("Không tìm thấy thông báo");
        }
        if (notification.IdUser != _curUser.UserId)
        {
            throw new UnauthorizedAccessException("Không có quyền với thông báo này");
        }

        await _notificationRepo.MarkAsRead(request.IdNotification);
        return true;
    }
}