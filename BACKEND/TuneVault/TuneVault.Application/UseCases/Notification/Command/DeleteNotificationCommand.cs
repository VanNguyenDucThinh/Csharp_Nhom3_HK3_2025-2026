using System;
using MediatR;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.Notification.Command;

[Authorize]
public class DeleteNotificationCommand : IRequest<bool>
{
    public Guid IdNotification { get; set; }

    public DeleteNotificationCommand(Guid idNotification)
    {
        IdNotification = idNotification;
    }
}