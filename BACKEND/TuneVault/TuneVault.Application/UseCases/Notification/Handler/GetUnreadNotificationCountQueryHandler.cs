using System;
using MediatR;
using TuneVault.Application.UseCases.Notification.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Notification.Handler;

public class GetUnreadNotificationCountQueryHandler : IRequestHandler<GetUnreadNotificationCountQuery, int>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly ICurentUserService _curUser;

    public GetUnreadNotificationCountQueryHandler(INotificationRepository notificationRepo, ICurentUserService curUser)
    {
        _notificationRepo = notificationRepo;
        _curUser = curUser;
    }

    public async Task<int> Handle(GetUnreadNotificationCountQuery request, CancellationToken cancellationToken)
    {
        return await _notificationRepo.GetUnreadCountByUserId(_curUser.UserId);
    }
}