using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases;
using TuneVault.Application.UseCases.Share.Command;
using TuneVault.Domain.Enums;

namespace TuneVault.API.Controllers;

/// <summary>
/// B6 — Chia sẻ Media giữa người dùng (0.5đ) — được chấm kỹ!
/// Chức năng 8 — Gửi bài hát/playlist cho user khác
/// </summary>
[Authorize]
public class ShareController : BaseApiController
{
    // POST api/share
    /// <summary>Chia sẻ media hoặc playlist cho người dùng khác — Chức năng 8 (B6)</summary>
    /// <remarks>
    /// Pipeline trong ShareMediaCommandHandler:
    /// 1. Kiểm tra sender != receiver
    /// 2. Tạo MediaShare record (IdSender, IdReceiver, IdMediaItem hoặc IdPlayList)
    /// 3. Publish MediaSharedEvent
    /// 4. MediaShareEventHandler: tạo Notification + gọi INotificationService.SendNotificationToUser (SignalR)
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ShareMediaDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ShareMedia([FromBody] ShareMediaRequest request)
    {
        var command = new ShareMediaCommand(
            request.ReceiverUserId,
            request.ItemId,
            request.ShareStyle);

        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Notification));

        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<ShareMediaDto>.Ok(result, result.Notification));
    }

    // GET api/share/received
    /// <summary>Danh sách media/playlist được chia sẻ với tôi — Chức năng 8</summary>
    /// <remarks>
    /// Gọi GetSharedQuery() — Handler dùng ICurrentUserService để lấy userId hiện tại.
    /// Trả về List&lt;SharedItemDto&gt; gồm cả Media và Playlist.
    /// </remarks>
    [HttpGet("received")]
    [ProducesResponseType(typeof(ApiResponse<List<SharedItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetReceived()
    {
        // GetSharedQuery không cần tham số — Handler tự lấy userId từ ICurrentUserService
        var query = new GetSharedQuery();
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<List<SharedItemDto>>.Ok(result));
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────

/// <summary>Dữ liệu chia sẻ media</summary>
public record ShareMediaRequest(
    /// <summary>ID người nhận</summary>
    [property: System.ComponentModel.DataAnnotations.Required]
    Guid ReceiverUserId,

    /// <summary>ID của media hoặc playlist cần chia sẻ</summary>
    [property: System.ComponentModel.DataAnnotations.Required]
    Guid ItemId,

    /// <summary>Loại item: Media = 0, Playlist = 1 (theo Domain.Enums.ShareStyle)</summary>
    [property: System.ComponentModel.DataAnnotations.Required]
    ShareStyle ShareStyle
);