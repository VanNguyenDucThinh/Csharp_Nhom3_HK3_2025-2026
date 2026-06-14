using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// B6 — Chia sẻ Media giữa người dùng (0.5đ) — được chấm kỹ!
/// Chức năng 8 — Chia sẻ bài hát/playlist/video cho user khác
/// Pipeline: validate → check receiver tồn tại → tạo MediaShare → tạo Notification → push SignalR
/// </summary>
[Authorize]
public class ShareController : BaseApiController
{
    // =====================================================================
    // POST api/share
    // Gửi bài hát / playlist cho người dùng khác
    // =====================================================================
    /// <summary>Chia sẻ media hoặc playlist cho người dùng khác — Chức năng 8</summary>
    /// <remarks>
    /// Pipeline:
    /// 1. Validate: phải có MediaId hoặc PlaylistId (không được có cả hai)
    /// 2. Kiểm tra receiver tồn tại
    /// 3. Kiểm tra sender != receiver
    /// 4. Tạo MediaShare record
    /// 5. Tạo Notification record
    /// 6. Push SignalR notification đến receiver
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ShareResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ShareMedia([FromBody] ShareMediaRequest request)
    {
        // Validation tại Controller (nhanh, không cần MediatR)
        if (request.MediaId is null && request.PlaylistId is null)
            return BadRequest(ApiResponse.Fail("Phải cung cấp MediaId hoặc PlaylistId"));

        if (request.MediaId is not null && request.PlaylistId is not null)
            return BadRequest(ApiResponse.Fail("Chỉ được chọn một: MediaId hoặc PlaylistId"));

        if (request.ReceiverUserId == CurrentUserId)
            return BadRequest(ApiResponse.Fail("Không thể chia sẻ cho chính mình"));

        // TODO: var command = new ShareMediaCommand(
        //     SenderId:    CurrentUserId,
        //     ReceiverId:  request.ReceiverUserId,
        //     MediaId:     request.MediaId,
        //     PlaylistId:  request.PlaylistId,
        //     Message:     request.Message);
        // TODO: var result = await Mediator.Send(command);
        //   Handler sẽ:
        //     1. Kiểm tra receiver tồn tại (NotFoundException nếu không)
        //     2. Tạo MediaShare record
        //     3. Tạo Notification record (type: "share")
        //     4. Inject INotificationPusher → push SignalR đến user-{receiverId}
        // TODO: return CreatedAtAction(nameof(GetSent), null,
        //     ApiResponse<ShareResponse>.Ok(result, "Đã chia sẻ thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/share/received?page=1&pageSize=10
    // Danh sách media được chia sẻ với tôi
    // =====================================================================
    /// <summary>Danh sách media/playlist được chia sẻ với tôi</summary>
    [HttpGet("received")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ShareResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetReceived(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        // TODO: var query = new GetReceivedSharesQuery(CurrentUserId, page, pageSize);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<ShareResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/share/sent?page=1&pageSize=10
    // Danh sách media tôi đã chia sẻ
    // =====================================================================
    /// <summary>Danh sách media/playlist tôi đã chia sẻ</summary>
    [HttpGet("sent")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<ShareResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSent(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        // TODO: var query = new GetSentSharesQuery(CurrentUserId, page, pageSize);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<ShareResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/share/{id}
    // Lấy chi tiết một lượt chia sẻ
    // =====================================================================
    /// <summary>Lấy chi tiết một lượt chia sẻ</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ShareResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // TODO: var query = new GetShareByIdQuery(id, CurrentUserId);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<ShareResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // DELETE api/share/{id}
    // Thu hồi share (chỉ người gửi)
    // =====================================================================
    /// <summary>Thu hồi lượt chia sẻ — chỉ người gửi</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Revoke(Guid id)
    {
        // TODO: var command = new RevokeShareCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã thu hồi chia sẻ"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──────────────────────────────────────────────────────────────────

public record ShareMediaRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    Guid ReceiverUserId,

    Guid? MediaId,
    Guid? PlaylistId,

    [property: System.ComponentModel.DataAnnotations.StringLength(500)]
    string? Message
);

public record ShareResponse(
    Guid Id,
    Guid SenderId,
    string SenderName,
    string? SenderAvatarUrl,
    Guid ReceiverId,
    string ReceiverName,
    Guid? MediaId,
    string? MediaTitle,
    string? MediaThumbnailUrl,
    Guid? PlaylistId,
    string? PlaylistName,
    string? Message,
    DateTime SharedAt
);