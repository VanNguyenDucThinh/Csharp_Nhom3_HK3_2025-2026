using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// B7 — Thông báo SignalR + lưu CSDL (1.0đ) — được chấm kỹ!
/// Chức năng 9 — Thông báo khi được chia sẻ, được follow, playlist được share.
/// SignalR Hub: /notificationHub
/// </summary>
[Authorize]
public class NotificationController : BaseApiController
{
    // =====================================================================
    // GET api/notification?page=1&pageSize=20&onlyUnread=false
    // Lấy danh sách thông báo của người dùng
    // =====================================================================
    /// <summary>Lấy danh sách thông báo — Chức năng 9</summary>
    /// <remarks>
    /// Type thông báo: "share", "follow", "playlist_share", "like".
    /// Sắp xếp mới nhất trước.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<NotificationResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNotifications(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] bool onlyUnread = false)
    {
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 20;

        // TODO: var query = new GetNotificationsQuery(CurrentUserId, page, pageSize, onlyUnread);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<NotificationResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/notification/unread-count
    // Đếm số thông báo chưa đọc (badge trên UI)
    // =====================================================================
    /// <summary>Đếm số thông báo chưa đọc (dùng cho badge UI)</summary>
    [HttpGet("unread-count")]
    [ProducesResponseType(typeof(ApiResponse<UnreadCountResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUnreadCount()
    {
        // TODO: var query = new GetUnreadNotificationCountQuery(CurrentUserId);
        // TODO: var count = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<UnreadCountResponse>.Ok(new(count)));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // PUT api/notification/{id}/read
    // Đánh dấu một thông báo đã đọc
    // =====================================================================
    /// <summary>Đánh dấu một thông báo đã đọc</summary>
    [HttpPut("{id:guid}/read")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        // TODO: var command = new MarkNotificationReadCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã đánh dấu đã đọc"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // PUT api/notification/read-all
    // Đánh dấu tất cả thông báo đã đọc
    // =====================================================================
    /// <summary>Đánh dấu tất cả thông báo đã đọc</summary>
    [HttpPut("read-all")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> MarkAllAsRead()
    {
        // TODO: var command = new MarkAllNotificationsReadCommand(CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã đánh dấu tất cả đã đọc"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // DELETE api/notification/{id}
    // Xóa một thông báo
    // =====================================================================
    /// <summary>Xóa một thông báo</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // TODO: var command = new DeleteNotificationCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa thông báo"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // DELETE api/notification/clear-all
    // Xóa tất cả thông báo của tôi
    // =====================================================================
    /// <summary>Xóa tất cả thông báo của tôi</summary>
    [HttpDelete("clear-all")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> ClearAll()
    {
        // TODO: var command = new ClearAllNotificationsCommand(CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa tất cả thông báo"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──────────────────────────────────────────────────────────────────

public record NotificationResponse(
    Guid Id,

    /// <summary>Loại thông báo: "share", "follow", "playlist_share", "like"</summary>
    string Type,

    string Title,
    string Message,
    bool IsRead,
    DateTime CreatedAt,
    Guid? RelatedUserId,
    string? RelatedUserName,
    string? RelatedUserAvatarUrl,
    Guid? RelatedMediaId,
    string? RelatedMediaTitle,
    Guid? RelatedPlaylistId,
    string? RelatedPlaylistName,

    /// <summary>JSON payload linh hoạt cho từng loại notification</summary>
    object? Payload
);

public record UnreadCountResponse(int Count);