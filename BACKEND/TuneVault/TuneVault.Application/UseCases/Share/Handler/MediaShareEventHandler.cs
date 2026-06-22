using System;
using MediatR;
using TuneVault.Domain.Events;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;
namespace TuneVault.Application.UseCases.Share.Handler;

public class MediaShareEventHandler:INotificationHandler<MediaSharedEvent>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly INotificationService _notificationSer;
    private readonly IUserProfileRepository _userProfile;

    public MediaShareEventHandler(INotificationRepository notificationRepo, INotificationService notificationSer, IUserProfileRepository userProfile)
    {
        _notificationRepo=notificationRepo;
        _notificationSer=notificationSer;
        _userProfile=userProfile;
    }
    public async Task Handle(MediaSharedEvent notification, CancellationToken cancellationToken)
    {
        var nameSend = await _userProfile.GetUserProfileById(notification.SenderId);
        string message = $"{nameSend.Name} đã gửi cho bạn {notification.TitleItem}";

        var newNotification = new Notification
        {
            Id=Guid.NewGuid(),
            IdUser=notification.ReceiverId,
            Payload=message,
            Type=TypeNotification.MediaShare,
            CreatAt=DateTime.UtcNow,
            IdItem=notification.ItemId,
            IsRead=Read.NotRead
        };
        await _notificationRepo.CreateNotification(newNotification);

        await _notificationSer.SendNotificationToUser(notification.ReceiverId, newNotification);

    }

}
