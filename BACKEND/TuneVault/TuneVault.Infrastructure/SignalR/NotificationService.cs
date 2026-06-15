using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.SignalR
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendNotificationToGroup(Guid UserId, Notification notification)
        {
            await _hubContext.Clients.User(UserId).SendAsync("ReceiveNotification", notification);
        }

        public async Task SendNotificationToUser(Guid GroupName, Notification notification)
        {
            await _hubContext.Clients.Group(GroupName).SendAsync("ReceiveNotification", notification);
        }
    }
}
