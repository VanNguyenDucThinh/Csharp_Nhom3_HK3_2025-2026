using System;
using MediatR;

namespace TuneVault.Domain.Events;

public class UserFollowedEvent:INotification
{
    public Guid FollowerId { get; set; }
    public Guid FollowedId { get; set; }

    public UserFollowedEvent(Guid followerId, Guid followedId)
    {
        FollowerId = followerId;
        FollowedId = followedId;
    }

}
