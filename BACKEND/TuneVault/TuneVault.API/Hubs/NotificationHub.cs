using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TuneVault.API.Hubs;

/// <summary>
/// SignalR Hub cho thông báo real-time
/// Frontend kết nối: const conn = new signalR.HubConnectionBuilder()
///   .withUrl("/notificationHub", { accessTokenFactory: () => token })
///   .build();
/// </summary>
[Authorize]
public class NotificationHub : Hub
{
    // ── Client methods (frontend lắng nghe) ──────────────────────────
    // conn.on("ReceiveNotification", (notification) => { ... })
    // conn.on("UnreadCountUpdated", (count) => { ... })

    public override async Task OnConnectedAsync()
    {
        // Thêm user vào group riêng theo UserId
        // → cho phép push đến user cụ thể từ bất kỳ service nào
        var userId = Context.UserIdentifier;
        if (userId is not null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        if (userId is not null)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user-{userId}");

        await base.OnDisconnectedAsync(exception);
    }

    // ── Server method (frontend gọi lên) ─────────────────────────────
    // conn.invoke("MarkAsRead", notificationId)
    public async Task MarkAsRead(Guid notificationId)
    {
        // TODO: gọi MediatR command MarkNotificationReadCommand
        // TODO: sau đó push lại unread count mới
        await Clients.Caller.SendAsync("NotificationRead", notificationId);
    }
}

/// <summary>
/// Interface để Infrastructure layer push notification qua SignalR
/// Inject INotificationPusher vào ShareMediaHandler
/// </summary>
public interface INotificationPusher
{
    Task PushToUserAsync(Guid userId, object notification, CancellationToken ct = default);
    Task UpdateUnreadCountAsync(Guid userId, int count, CancellationToken ct = default);
}

/// <summary>
/// Implementation — đăng ký trong Infrastructure DI
/// </summary>
public class SignalRNotificationPusher : INotificationPusher
{
    private readonly IHubContext<NotificationHub> _hub;

    public SignalRNotificationPusher(IHubContext<NotificationHub> hub)
        => _hub = hub;

    public async Task PushToUserAsync(Guid userId, object notification, CancellationToken ct = default)
        => await _hub.Clients
            .Group($"user-{userId}")
            .SendAsync("ReceiveNotification", notification, ct);

    public async Task UpdateUnreadCountAsync(Guid userId, int count, CancellationToken ct = default)
        => await _hub.Clients
            .Group($"user-{userId}")
            .SendAsync("UnreadCountUpdated", count, ct);
}
