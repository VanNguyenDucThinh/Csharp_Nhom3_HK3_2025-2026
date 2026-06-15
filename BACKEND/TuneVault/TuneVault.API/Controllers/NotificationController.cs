using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// B7 — Thông báo SignalR + lưu CSDL (1.0đ) — được chấm kỹ!
/// Chức năng 9 — Nhận thông báo khi được share, follow, v.v.
///
/// Luồng push real-time (B7):
///   ShareMediaCommandHandler / UserFollowCommandHandler
///     → Publish MediaSharedEvent / UserFollowedEvent
///       → MediaShareEventHandler / UserFollowedEventHandler
///           → INotificationRepository.CreateNotification (lưu CSDL)
///           → INotificationService.SendNotificationToUser (push SignalR)
///
/// REST API này dùng để quản lý notification đã lưu trong CSDL.
/// </summary>
[Authorize]
public class NotificationController : BaseApiController
{
    // GET api/notification
    /// <summary>Lấy danh sách thông báo của tôi</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNotifications(
        [FromQuery] bool onlyUnread = false)
    {
        // TODO: var query = new GetNotificationsQuery(CurrentUserId, onlyUnread);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<List<NotificationDto>>.Ok(result));
        return StatusCode(501, ApiResponse.Fail("Chờ GetNotificationsQuery"));
    }

    // GET api/notification/unread-count
    /// <summary>Đếm số thông báo chưa đọc (dùng cho badge trên UI)</summary>
    [HttpGet("unread-count")]
    [ProducesResponseType(typeof(ApiResponse<int>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUnreadCount()
    {
        // TODO: var query = new GetUnreadCountQuery(CurrentUserId);
        // TODO: var count = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<int>.Ok(count));
        return StatusCode(501, ApiResponse.Fail("Chờ GetUnreadCountQuery"));
    }

    // PUT api/notification/{id}/read
    /// <summary>Đánh dấu một thông báo đã đọc</summary>
    [HttpPut("{id:guid}/read")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        // TODO: var command = new MarkNotificationReadCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã đánh dấu đã đọc"));
        return StatusCode(501, ApiResponse.Fail("Chờ MarkNotificationReadCommand"));
    }

    // PUT api/notification/read-all
    /// <summary>Đánh dấu tất cả thông báo đã đọc</summary>
    [HttpPut("read-all")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> MarkAllAsRead()
    {
        // TODO: var command = new MarkAllNotificationsReadCommand(CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã đánh dấu tất cả đã đọc"));
        return StatusCode(501, ApiResponse.Fail("Chờ MarkAllNotificationsReadCommand"));
    }

    // DELETE api/notification/{id}
    /// <summary>Xóa một thông báo</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // TODO: var command = new DeleteNotificationCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa thông báo"));
        return StatusCode(501, ApiResponse.Fail("Chờ DeleteNotificationCommand"));
    }
}