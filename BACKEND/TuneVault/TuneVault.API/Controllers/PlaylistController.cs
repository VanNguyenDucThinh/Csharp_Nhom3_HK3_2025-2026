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
        return StatusCode(501, ApiResponse.Fail("Chờ GetMyPlaylistsQuery"));
    }

    // GET api/playlist/{id}
    /// <summary>Xem chi tiết playlist kèm danh sách track</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        return StatusCode(501, ApiResponse.Fail("Chờ GetPlaylistByIdQuery"));
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
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePlaylistRequest request)
    {
        return StatusCode(501, ApiResponse.Fail("Chờ UpdatePlayListCommand"));
    }

    // DELETE api/playlist/{id}
    /// <summary>Xóa playlist — chỉ chủ sở hữu</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        return StatusCode(501, ApiResponse.Fail("Chờ DeletePlayListCommand"));
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
        return StatusCode(501, ApiResponse.Fail("Chờ RemoveTrackFromPlaylistCommand"));
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────

public record CreatePlaylistRequest{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    public string Name{get; set;}

    public bool IsPublic{get; set;} = true;
};

public record UpdatePlaylistRequest{
    [System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    public string? Name{get; set;}

    public bool? IsPublic{get; set;}
};

public record AddTrackRequest{
    [System.ComponentModel.DataAnnotations.Required]
    public Guid MediaId{get; set;}
};