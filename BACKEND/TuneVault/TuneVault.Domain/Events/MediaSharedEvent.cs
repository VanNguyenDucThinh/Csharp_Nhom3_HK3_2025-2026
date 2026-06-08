using System;
using MediatR;

namespace TuneVault.Domain.Events;

public class MediaSharedEvent:INotification
{
    public Guid MediaItemId { get; set; }
    public Guid SharedByUserId { get; set; }
    public Guid SharedWithUserId { get; set; }
    public DateTime SharedDate { get; set; } = DateTime.UtcNow;

    public MediaSharedEvent(Guid mediaItemId, Guid sharedByUserId, Guid sharedWithUserId)
    {
        MediaItemId = mediaItemId;
        SharedByUserId = sharedByUserId;
        SharedWithUserId = sharedWithUserId;
    }

}
