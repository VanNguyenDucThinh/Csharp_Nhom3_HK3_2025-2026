using System;
using MediatR;
using TuneVault.Application.UseCases.Notification.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Notification.Handler;

public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotificationCommand, bool>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly ICurentUserService _curUser;

    public DeleteNotificationCommandHandler(INotificationRepository notificationRepo, ICurentUserService curUser)
    {
        _notificationRepo = notificationRepo;
        _curUser = curUser;
    }

    public async Task<bool> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
    {
        var notification = await _notificationRepo.GetNotificationById(request.IdNotification);
        if (notification == null)
        {
            throw new Exception("Không tìm thấy thông báo");
        }
        if (notification.IdUser != _curUser.UserId)
        {
            throw new UnauthorizedAccessException("Không có quyền xóa thông báo này");
        }

        await _notificationRepo.DeleteNotification(request.IdNotification);
        return true;
    }
}