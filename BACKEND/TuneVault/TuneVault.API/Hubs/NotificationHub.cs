using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TuneVault.API.Hubs;

/// <summary>
/// B7 — SignalR Hub cho thông báo real-time.
///
/// Frontend kết nối:
/// <code>
/// const conn = new signalR.HubConnectionBuilder()
///   .withUrl("/notificationHub", { accessTokenFactory: () => token })
///   .withAutomaticReconnect()
///   .build();
///
/// // Lắng nghe sự kiện
/// conn.on("ReceiveNotification", (notification) => { ... })
/// conn.on("UnreadCountUpdated", (count) => { ... })
/// conn.on("NotificationRead", (notificationId) => { ... })
/// </code>
/// </summary>
[Authorize]
public class NotificationHub : Hub
{
    // ── Client methods (frontend lắng nghe) ──────────────────────────────
    // "ReceiveNotification"  — nhận notification mới (khi được share, follow, v.v.)
    // "UnreadCountUpdated"   — badge số chưa đọc thay đổi
    // "NotificationRead"     — một notification vừa được đánh dấu đã đọc

    public override async Task OnConnectedAsync()
    {
        // Mỗi user có group riêng theo UserId
        // → Infrastructure layer push đến group này khi cần notify user cụ thể
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

    // ── Server methods (frontend invoke) ─────────────────────────────────

    /// <summary>
    /// Frontend gọi khi user đánh dấu đọc trực tiếp từ notification panel.
    /// conn.invoke("MarkAsRead", notificationId)
    /// </summary>
    public async Task MarkAsRead(Guid notificationId)
    {
        // TODO: lấy MediatR ISender từ DI
        // var mediator = Context.GetHttpContext()!.RequestServices.GetRequiredService<ISender>();
        // var userId = Guid.Parse(Context.UserIdentifier!);
        // await mediator.Send(new MarkNotificationReadCommand(notificationId, userId));

        // Phản hồi cho client đã gọi
        await Clients.Caller.SendAsync("NotificationRead", notificationId);

        // TODO: push unread count mới về client
        // var count = await mediator.Send(new GetUnreadNotificationCountQuery(userId));
        // await Clients.Caller.SendAsync("UnreadCountUpdated", count);
    }

    /// <summary>
    /// Frontend gọi để ping giữ kết nối (tuỳ chọn).
    /// conn.invoke("Ping")
    /// </summary>
    public async Task Ping()
    {
        await Clients.Caller.SendAsync("Pong", DateTimeOffset.UtcNow);
    }
}

/// <summary>
/// Interface để Infrastructure layer push notification qua SignalR.
/// Inject INotificationPusher vào ShareMediaHandler, FollowUserHandler, v.v.
/// </summary>
public interface INotificationPusher
{
    /// <summary>Push một notification đến user cụ thể</summary>
    Task PushToUserAsync(Guid userId, object notification, CancellationToken ct = default);

    /// <summary>Cập nhật badge số chưa đọc cho user</summary>
    Task UpdateUnreadCountAsync(Guid userId, int count, CancellationToken ct = default);
}

/// <summary>
/// Implementation của INotificationPusher — đăng ký trong HostingExtensions.
/// </summary>
public class SignalRNotificationPusher : INotificationPusher
{
    private readonly IHubContext<NotificationHub> _hub;

    public SignalRNotificationPusher(IHubContext<NotificationHub> hub) => _hub = hub;

    public async Task PushToUserAsync(Guid userId, object notification, CancellationToken ct = default)
        => await _hub.Clients
            .Group($"user-{userId}")
            .SendAsync("ReceiveNotification", notification, ct);

    public async Task UpdateUnreadCountAsync(Guid userId, int count, CancellationToken ct = default)
        => await _hub.Clients
            .Group($"user-{userId}")
            .SendAsync("UnreadCountUpdated", count, ct);
}