using System;
using MediatR;

namespace TuneVault.Domain.Events;

public class UserFollowedEvent:INotification
{
    public Guid FollowerId { get; set; }//Nguoi nhấn follow
    public Guid FollowedId { get; set; }//Người được follow

    public UserFollowedEvent(Guid followerId, Guid followedId)
    {
        FollowerId = followerId;
        FollowedId = followedId;
    }

}
