using System;
using MediatR;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.Notification.Command;

[Authorize]
public class MarkNotificationReadCommand : IRequest<bool>
{
    public Guid IdNotification { get; set; }

    public MarkNotificationReadCommand(Guid idNotification)
    {
        IdNotification = idNotification;
    }
}