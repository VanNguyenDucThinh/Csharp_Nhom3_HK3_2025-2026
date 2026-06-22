using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.UseCases.NotificationUser.Command;
using TuneVault.Application.DTOs;

namespace TuneVault.API.Controllers;
[Authorize]public class NotificationController : BaseApiController
{
    // GET api/notification
    /// <summary>Lấy danh sách thông báo của tôi</summary>
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNotifications()
    {
        var query = new GetNotificationQuery();
        var result = await Mediator.Send(query);
        if (result == null)
        {
            return NotFound("Không có thông báo");
        }
        return Ok(ApiResponse<List<NotificationDto>>.Ok(result));

    }
    [HttpPut("{id:guid}/read")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var command = new MaskAsReadQuery(id);
        await Mediator.Send(command);
        return Ok(ApiResponse.Ok("Đã đánh dấu đã đọc"));
    }
}