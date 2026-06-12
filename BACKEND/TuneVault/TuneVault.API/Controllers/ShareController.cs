using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// B6 — Chia sẻ Media giữa người dùng (0.5đ) — được chấm kỹ!
/// </summary>
[Authorize]
public class ShareController : BaseApiController
{
    // =============================================
    // POST api/share
    // Gửi bài hát / playlist cho người dùng khác
    // Body: { receiverUserId, mediaId? hoặc playlistId?, message? }
    // =============================================
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ShareResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ShareMedia([FromBody] ShareMediaRequest request)
    {
        if (request.MediaId is null && request.PlaylistId is null)
            return BadRequest(ApiResponse.Fail("Phải cung cấp MediaId hoặc PlaylistId"));

        if (request.MediaId is not null && request.PlaylistId is not null)
            return BadRequest(ApiResponse.Fail("Chỉ được chọn một: MediaId hoặc PlaylistId"));

        // TODO: var command = new ShareMediaCommand(
        //     SenderId: CurrentUserId,
        //     ReceiverId: request.ReceiverUserId,
        //     MediaId: request.MediaId,
        //     PlaylistId: request.PlaylistId,
        //     Message: request.Message);
        // TODO: var result = await Mediator.Send(command);
        //   → Handler sẽ:
        //     1. Kiểm tra receiver tồn tại
        //     2. Kiểm tra sender != receiver
        //     3. Tạo MediaShare record
        //     4. Tạo Notification record
        //     5. Push SignalR đến receiver
        // TODO: return CreatedAtAction(nameof(GetSent), ApiResponse<ShareResponse>.Ok(result, "Đã chia sẻ thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/share/received?page=1&pageSize=10
    // Danh sách media được chia sẻ với tôi
    // =============================================
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

    // =============================================
    // GET api/share/sent?page=1&pageSize=10
    // Danh sách media tôi đã chia sẻ
    // =============================================
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

    // =============================================
    // DELETE api/share/{id}
    // Thu hồi share (chỉ người gửi)
    // =============================================
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Revoke(Guid id)
    {
        // TODO: var command = new RevokeShareCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã thu hồi chia sẻ"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──
public record ShareMediaRequest(
    Guid ReceiverUserId,
    Guid? MediaId,
    Guid? PlaylistId,
    string? Message);

public record ShareResponse(
    Guid Id,
    Guid SenderId, string SenderName,
    Guid ReceiverId, string ReceiverName,
    Guid? MediaId, string? MediaTitle,
    Guid? PlaylistId, string? PlaylistName,
    string? Message,
    DateTime SharedAt);
