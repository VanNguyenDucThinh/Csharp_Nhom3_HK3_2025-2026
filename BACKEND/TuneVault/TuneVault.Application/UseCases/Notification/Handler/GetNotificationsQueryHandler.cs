using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Notification.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Notification.Handler;

public class GetNotificationsQueryHandler : IRequestHandler<GetNotificationsQuery, List<NotificationDto>>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly ICurentUserService _curUser;

    public GetNotificationsQueryHandler(INotificationRepository notificationRepo, ICurentUserService curUser)
    {
        _notificationRepo = notificationRepo;
        _curUser = curUser;
    }

    public async Task<List<NotificationDto>> Handle(GetNotificationsQuery request, CancellationToken cancellationToken)
    {
        var list = await _notificationRepo.GetNotificationsByUserId(_curUser.UserId, request.OnlyUnread);

        return list.Select(x => new NotificationDto
        {
            Id = x.Id,
            Payload = x.Payload,
            Type = x.Type,
            CreatAt = x.CreatAt,
            IsRead = x.IsRead,
            IdItem = x.IdItem
        }).ToList();
    }
}