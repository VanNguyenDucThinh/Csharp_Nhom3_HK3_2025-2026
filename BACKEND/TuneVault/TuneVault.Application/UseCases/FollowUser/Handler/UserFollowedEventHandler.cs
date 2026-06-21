using System;
using MediatR;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Enums;


namespace TuneVault.Application.UseCases.FollowUser.Handler;

public class UserFollowedEventHandler:INotificationHandler<UserFollowedEvent>
{
    private readonly INotificationRepository _notificationRepo;
    private readonly INotificationService _notificationSer;
    private readonly IUserProfileRepository _userProfile;

    public UserFollowedEventHandler(INotificationRepository notificationRepo, INotificationService notificationSer, IUserProfileRepository userProfile)
    {
        _notificationRepo=notificationRepo;
        _notificationSer=notificationSer;
        _userProfile=userProfile;
    }

    public async Task Handle(UserFollowedEvent notification, CancellationToken cancellationToken)
    {
        var follower = await _userProfile.GetUserProfileById(notification.FollowerId);
        var message = $"{follower.Name} đã follow bạn";
        var newNotification = new Notification
        {
            Id=Guid.NewGuid(),
            IdUser=notification.FollowedId,
            Payload=message,
            Type=TypeNotification.Follow,
            CreatAt=DateTime.UtcNow,
            IsRead=Read.NotRead
        };

        await _notificationRepo.CreateNotification(newNotification);

        await _notificationSer.SendNotificationToUser(notification.FollowedId, newNotification);
    }

}
