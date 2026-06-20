using System;
using MediatR;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.Notification.Command;

[Authorize]
public class MarkAllNotificationsReadCommand : IRequest<bool>
{
}