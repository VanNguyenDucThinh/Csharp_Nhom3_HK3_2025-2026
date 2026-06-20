using System;
using MediatR;

namespace TuneVault.Application.UseCases.Notification.Command;

public class GetUnreadNotificationCountQuery : IRequest<int>
{
}