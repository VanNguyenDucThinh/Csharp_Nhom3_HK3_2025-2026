using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.HistoryMedia.Command;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 10 — Lịch sử nghe gần đây
/// </summary>
[Authorize]
public class HistoryController : BaseApiController
{
    // GET api/history
    /// <summary>Lấy lịch sử nghe/xem gần đây của tôi — Chức năng 10</summary>
    /// <remarks>
    /// Gọi GetHistoryQuery. Lịch sử được tự động ghi nhận mỗi khi
    /// AudioQueryHandler / GetVideoQueryHandler publish SaveHistoryEvent -> SaveHistoryEventHandler.
    /// Lưu ý: tham số IdUser truyền vào GetHistoryQuery không được Handler sử dụng để lọc —
    /// Handler tự lấy UserId từ ICurrentUserService bên trong, tham số chỉ giữ để khớp signature.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<HistoryMediaDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyHistory()
    {
        var query = new GetHistoryQuery(CurrentUserId);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<List<HistoryMediaDto>>.Ok(result));
    }
}