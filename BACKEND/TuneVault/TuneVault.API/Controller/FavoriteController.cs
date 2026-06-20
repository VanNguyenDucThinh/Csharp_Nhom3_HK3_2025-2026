using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Favorite.Command;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 10 — Tương tác: Like/Favorite track
/// </summary>
[Authorize]
public class FavoriteController : BaseApiController
{
    // POST api/favorite/{mediaId}
    /// <summary>Toggle yêu thích (favorite/unfavorite) một bài hát — Chức năng 10</summary>
    /// <remarks>
    /// Gọi ToggleFavoriteCommand(mediaId). Handler tự kiểm tra trạng thái hiện tại:
    /// nếu đã favorite -> bỏ favorite; nếu chưa -> thêm vào favorite.
    /// UserId lấy từ ICurrentUserService bên trong handler, không cần truyền qua route/body.
    /// </remarks>
    [HttpPost("{mediaId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<FavoriteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleFavorite(Guid mediaId)
    {
        var command = new ToggleFavoriteCommand(mediaId);
        var result = await Mediator.Send(command);

        var message = result.IsFavorite ? "Đã thêm vào yêu thích" : "Đã bỏ khỏi yêu thích";
        return Ok(ApiResponse<FavoriteDto>.Ok(result, message));
    }

    // GET api/favorite
    /// <summary>Danh sách bài hát đã yêu thích của tôi</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public IActionResult GetMyFavorites()
    {
        // NOTE: Application layer hiện chỉ có ToggleFavoriteCommand (bật/tắt 1 bài),
        // chưa có GetFavoritesQuery/Handler để lấy DANH SÁCH các bài đã favorite.
        // Cần bổ sung Query + Handler (tương tự GetHistoryQuery) trong
        // TuneVault.Application.UseCases.Favorite trước khi wire endpoint này.
        return StatusCode(501, ApiResponse.Fail("Chờ GetFavoritesQuery (chưa có trong Application layer)"));
    }
}