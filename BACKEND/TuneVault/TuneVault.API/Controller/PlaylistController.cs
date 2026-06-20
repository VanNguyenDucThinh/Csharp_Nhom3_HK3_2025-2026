using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Application.UseCases.PlayList.Handler;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 6 — Playlist CRUD + quản lý track
/// </summary>
[Authorize]
public class PlaylistController : BaseApiController
{
    // GET api/playlist
    /// <summary>Lấy danh sách playlist của tôi</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<PlayListDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyPlaylists()
    {
        // NOTE: Application layer hiện chưa có GetMyPlaylistsQuery/Handler.
        // UseCases/PlayList chỉ có GetPlayListQuery (lấy 1 playlist theo Id),
        // không có query lấy danh sách playlist theo Owner.
        // Cần bổ sung Command + Handler trong TuneVault.Application.UseCases.PlayList trước khi wire endpoint này.
        return StatusCode(501, ApiResponse.Fail("Chờ GetMyPlaylistsQuery (chưa có trong Application layer)"));
    }

    // GET api/playlist/{id}
    /// <summary>Xem chi tiết playlist kèm danh sách track</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // GetPlayListQuery -> GetPlayListQueryCommand handler: trả PlayListDto kèm Track,
        // tự kiểm tra quyền riêng tư (ném UnauthorizedAccessException nếu playlist private và không phải chủ sở hữu).
        var query = new GetPlayListQuery(id);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<PlayListDto>.Ok(result));
    }

    // POST api/playlist
    /// <summary>Tạo playlist mới — Chức năng 6</summary>
    /// <remarks>
    /// Gọi CreatePlayListCommand(name, isPublic, owner).
    /// Owner = CurrentUserId lấy từ JWT.
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePlaylistRequest request)
    {
        var command = new CreatePlayListCommand(
            request.Name,
            request.IsPublic,
            CurrentUserId);

        var result = await Mediator.Send(command);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<PlayListDto>.Ok(result, "Tạo playlist thành công"));
    }

    // PUT api/playlist/{id}
    /// <summary>Cập nhật playlist — chỉ chủ sở hữu</summary>
    /// <remarks>
    /// Gọi UpdatePlayListCommand. Handler tự so sánh playlist.Owner với CurrentUserId lấy từ ICurrentUserService
    /// (tham số idOwner truyền vào command không được handler dùng để check quyền, chỉ giữ để khớp signature).
    /// </remarks>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePlaylistRequest request)
    {
        var command = new UpdatePlayListCommand(
            CurrentUserId,
            id,
            request.Name,
            request.IsPublic ?? true, // TODO: handler hiện ghi đè IsPublic dù FE không gửi -> cân nhắc fetch giá trị cũ nếu cần partial update thật sự
            request.UrlImage);

        var result = await Mediator.Send(command);
        return Ok(ApiResponse<PlayListDto>.Ok(result, "Cập nhật playlist thành công"));
    }

    // DELETE api/playlist/{id}
    /// <summary>Xóa playlist — chỉ chủ sở hữu</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var command = new DeletePlayListComman(id); // lưu ý: tên class gốc thiếu chữ "d" (DeletePlayListComman thay vì ...Command)
        var success = await Mediator.Send(command);

        return success
            ? Ok(ApiResponse.Ok("Đã xóa playlist"))
            : BadRequest(ApiResponse.Fail("Không thể xóa playlist"));
    }

    // POST api/playlist/{id}/tracks
    /// <summary>Thêm track vào playlist — Chức năng 6</summary>
    /// <remarks>
    /// Gọi AddTrackToPlaylistCommand(idTrack, idPlayList).
    /// Handler kiểm tra: chủ playlist, track tồn tại, chưa có trong playlist.
    /// </remarks>
    [HttpPost("{id:guid}/tracks")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddTrack(Guid id, [FromBody] AddTrackRequest request)
    {
        var command = new AddTrackToPlaylistCommand(request.MediaId, id);
        var success = await Mediator.Send(command);

        return success
            ? Ok(ApiResponse.Ok("Đã thêm track vào playlist"))
            : BadRequest(ApiResponse.Fail("Không thể thêm track"));
    }

    // DELETE api/playlist/{id}/tracks/{mediaId}
    /// <summary>Xóa track khỏi playlist — Chức năng 6</summary>
    [HttpDelete("{id:guid}/tracks/{mediaId:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveTrack(Guid id, Guid mediaId)
    {
        var command = new RemoveTrackFromPlaylistCommand(id, mediaId);
        var success = await Mediator.Send(command);

        return success
            ? Ok(ApiResponse.Ok("Đã xóa track khỏi playlist"))
            : BadRequest(ApiResponse.Fail("Không thể xóa track"));
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────

public record CreatePlaylistRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    string Name,

    bool IsPublic = true
);

public record UpdatePlaylistRequest(
    [property: System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    string? Name,

    bool? IsPublic,

    string? UrlImage = null
);

public record AddTrackRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    Guid MediaId
);