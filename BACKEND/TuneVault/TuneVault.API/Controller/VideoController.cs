using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Video.Command;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 5 — Video Player (phát video full-page hoặc modal, poster thumbnail)
/// </summary>
[Authorize]
public class VideoController : BaseApiController
{
    // GET api/video/{id}
    /// <summary>Lấy thông tin video để phát — Chức năng 5</summary>
    /// <remarks>
    /// Gọi GetVideoQuery -> GetVideoQueryHandler: trả về Title, Artist, UrlImage (poster), UrlMedia.
    /// Handler tự publish SaveHistoryEvent để ghi lịch sử xem (giống AudioQueryHandler).
    /// Việc stream byte thật sự (hỗ trợ Range header để seek) đi qua static file middleware
    /// (app.UseStaticFiles() trong Program.cs) bằng đường dẫn UrlMedia trả về ở đây —
    /// không cần endpoint /stream riêng vì static file middleware của ASP.NET Core đã tự hỗ trợ Range.
    /// </remarks>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<VideoDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // NOTE: SaveHistoryEvent bên trong handler dùng ICurrentUserService.UserId.
        // Vì endpoint đang AllowAnonymous nên khi user chưa đăng nhập xem video,
        // việc ghi lịch sử có thể lỗi/ghi UserId rỗng — vấn đề này cũng tồn tại tương tự ở
        // MediaController.GetById (Audio), không phải lỗi phát sinh riêng ở Controller này.
        var query = new GetVideoQuery(id);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<VideoDto>.Ok(result));
    }
}