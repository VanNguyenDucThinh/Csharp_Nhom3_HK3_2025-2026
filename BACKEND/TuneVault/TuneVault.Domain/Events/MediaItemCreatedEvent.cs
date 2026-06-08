using System;
using MediatR;

namespace TuneVault.Domain.Events;

public class MediaItemCreatedEvent:INotification
{
    public Guid MediaItemId { get; set; }
    public string Title { get; set; }
    public Guid OwnerId { get; set; }

    public MediaItemCreatedEvent(Guid mediaItemId, string title, Guid ownerId)
    {
        MediaItemId = mediaItemId;
        Title = title;
        OwnerId = ownerId;
    }


}
