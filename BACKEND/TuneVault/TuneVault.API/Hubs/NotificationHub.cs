using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TuneVault.Domain.Interfaces;

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
    private readonly INotificationRepository _notificationRepo;

    public NotificationHub(INotificationRepository notificationRepo)
    {
        _notificationRepo = notificationRepo;
    }

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
        // KHÔNG gọi MediatR + MarkNotificationReadCommand ở đây, vì handler của command đó
        // inject ICurrentUserService, mà ICurrentUserService đọc UserId qua IHttpContextAccessor —
        // và IHttpContextAccessor.HttpContext KHÔNG đảm bảo có giá trị khi method của Hub được
        // gọi sau khi handshake WebSocket đã xong (middleware set HttpContextAccessor chỉ chạy
        // trong pipeline HTTP request thông thường, không chạy lại cho từng lần invoke qua Hub).
        // => Nếu gọi qua Mediator, UserId bên trong handler có thể bị null/rỗng dù connection đã auth.
        //
        // Né bằng cách: dùng Context.UserIdentifier (lấy thẳng từ JWT claim lúc handshake,
        // đáng tin cậy trong Hub — đã dùng y vậy ở OnConnectedAsync/OnDisconnectedAsync phía trên)
        // và gọi thẳng INotificationRepository, không qua MediatR pipeline cho riêng action real-time này.
        if (Context.UserIdentifier is null || !Guid.TryParse(Context.UserIdentifier, out var userId))
            return;

        var notification = await _notificationRepo.GetNotificationById(notificationId);
        if (notification is null || notification.IdUser != userId)
            return; // không tồn tại hoặc không phải chủ sở hữu -> bỏ qua, không báo lỗi qua Hub

        await _notificationRepo.MarkAsRead(notificationId);

        // Phản hồi cho client đã gọi
        await Clients.Caller.SendAsync("NotificationRead", notificationId);

        // Push unread count mới về client
        var count = await _notificationRepo.GetUnreadCountByUserId(userId);
        await Clients.Caller.SendAsync("UnreadCountUpdated", count);
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