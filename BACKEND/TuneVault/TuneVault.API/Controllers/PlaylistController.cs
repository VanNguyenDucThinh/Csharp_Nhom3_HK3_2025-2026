using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 6 — Playlist
/// CRUD playlist, thêm/xóa track, playlist công khai/riêng tư.
/// </summary>
[Authorize]
public class PlaylistController : BaseApiController
{
    // =====================================================================
    // GET api/playlist
    // Lấy danh sách playlist của tôi (My Playlists)
    // =====================================================================
    /// <summary>Lấy danh sách playlist của tôi (My Playlists)</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PlaylistResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyPlaylists()
    {
        // TODO: var query = new GetMyPlaylistsQuery(CurrentUserId);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<IEnumerable<PlaylistResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/playlist/public?page=1&pageSize=10
    // Lấy danh sách playlist công khai (khám phá)
    // =====================================================================
    /// <summary>Khám phá playlist công khai</summary>
    [HttpGet("public")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<PlaylistResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublicPlaylists(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        // TODO: var query = new GetPublicPlaylistsQuery(page, pageSize);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<PlaylistResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/playlist/{id}
    // Xem chi tiết playlist (kèm danh sách track)
    // =====================================================================
    /// <summary>Lấy chi tiết playlist kèm danh sách track</summary>
    /// <remarks>
    /// Playlist riêng tư chỉ chủ sở hữu mới xem được.
    /// Playlist công khai ai cũng xem được.
    /// </remarks>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PlaylistDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // TODO: var query = new GetPlaylistByIdQuery(id, CurrentUserIdOrNull);
        // TODO: var result = await Mediator.Send(query);
        // TODO: if (result is null) return NotFound(ApiResponse.Fail("Không tìm thấy playlist"));
        // TODO: return Ok(ApiResponse<PlaylistDetailResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/playlist
    // Tạo playlist mới
    // =====================================================================
    /// <summary>Tạo playlist mới</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PlaylistResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePlaylistRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ"));

        // TODO: var command = new CreatePlaylistCommand(CurrentUserId, request.Name, request.Description, request.IsPublic);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return CreatedAtAction(nameof(GetById), new { id = result.Id },
        //     ApiResponse<PlaylistResponse>.Ok(result, "Tạo playlist thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // PUT api/playlist/{id}
    // Cập nhật playlist (chỉ chủ sở hữu)
    // =====================================================================
    /// <summary>Cập nhật playlist — chỉ chủ sở hữu</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PlaylistResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePlaylistRequest request)
    {
        // TODO: var command = new UpdatePlaylistCommand(id, CurrentUserId, request.Name, request.Description, request.IsPublic);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<PlaylistResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // DELETE api/playlist/{id}
    // Xóa playlist (chỉ chủ sở hữu)
    // =====================================================================
    /// <summary>Xóa playlist — chỉ chủ sở hữu</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // TODO: var command = new DeletePlaylistCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa playlist"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/playlist/{id}/tracks
    // Thêm track vào playlist
    // =====================================================================
    /// <summary>Thêm track vào playlist</summary>
    [HttpPost("{id:guid}/tracks")]
    [ProducesResponseType(typeof(ApiResponse<PlaylistDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AddTrack(Guid id, [FromBody] AddTrackRequest request)
    {
        // TODO: var command = new AddTrackToPlaylistCommand(id, CurrentUserId, request.MediaId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã thêm track vào playlist"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // DELETE api/playlist/{id}/tracks/{mediaId}
    // Xóa track khỏi playlist
    // =====================================================================
    /// <summary>Xóa track khỏi playlist</summary>
    [HttpDelete("{id:guid}/tracks/{mediaId:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveTrack(Guid id, Guid mediaId)
    {
        // TODO: var command = new RemoveTrackFromPlaylistCommand(id, CurrentUserId, mediaId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa track khỏi playlist"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // PUT api/playlist/{id}/tracks/reorder
    // Sắp xếp lại thứ tự track trong playlist
    // =====================================================================
    /// <summary>Sắp xếp lại thứ tự track trong playlist</summary>
    [HttpPut("{id:guid}/tracks/reorder")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ReorderTracks(Guid id, [FromBody] ReorderTracksRequest request)
    {
        // TODO: var command = new ReorderPlaylistTracksCommand(id, CurrentUserId, request.OrderedMediaIds);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã cập nhật thứ tự track"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──────────────────────────────────────────────────────────────────

public record CreatePlaylistRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    string Name,

    [property: System.ComponentModel.DataAnnotations.StringLength(1000)]
    string? Description,

    bool IsPublic = true
);

public record UpdatePlaylistRequest(
    [property: System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    string? Name,

    [property: System.ComponentModel.DataAnnotations.StringLength(1000)]
    string? Description,

    bool? IsPublic
);

public record AddTrackRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    Guid MediaId
);

public record ReorderTracksRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    IEnumerable<Guid> OrderedMediaIds
);

public record PlaylistResponse(
    Guid Id,
    string Name,
    string? Description,
    string? CoverImageUrl,
    bool IsPublic,
    int TrackCount,
    int TotalDurationSeconds,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    Guid OwnerId,
    string OwnerName
);

public record PlaylistDetailResponse(
    Guid Id,
    string Name,
    string? Description,
    string? CoverImageUrl,
    bool IsPublic,
    DateTime CreatedAt,
    Guid OwnerId,
    string OwnerName,
    IEnumerable<PlaylistTrackResponse> Tracks
);

public record PlaylistTrackResponse(
    Guid MediaId,
    string Title,
    string? Artist,
    string MediaType,
    string FileUrl,
    string? ThumbnailUrl,
    int DurationSeconds,
    int Position,
    DateTime AddedAt
);