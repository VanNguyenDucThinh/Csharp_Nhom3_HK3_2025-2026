using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

[Authorize]
public class PlaylistController : BaseApiController
{
    // =============================================
    // GET api/playlist
    // Lấy danh sách playlist của mình
    // =============================================
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PlaylistResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyPlaylists()
    {
        // TODO: var query = new GetMyPlaylistsQuery(CurrentUserId);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<IEnumerable<PlaylistResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/playlist/{id}
    // Xem chi tiết playlist (kèm danh sách track)
    // =============================================
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PlaylistDetailResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // TODO: var query = new GetPlaylistByIdQuery(id, CurrentUserId);
        // TODO: var result = await Mediator.Send(query);
        // TODO: if (result is null) return NotFound(ApiResponse.Fail("Không tìm thấy playlist"));
        // TODO: return Ok(ApiResponse<PlaylistDetailResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // POST api/playlist
    // Tạo playlist mới
    // =============================================
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PlaylistResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreatePlaylistRequest request)
    {
        // TODO: var command = new CreatePlaylistCommand(CurrentUserId, request.Name, request.Description, request.IsPublic);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<PlaylistResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // PUT api/playlist/{id}
    // Cập nhật playlist (chỉ chủ sở hữu)
    // =============================================
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PlaylistResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePlaylistRequest request)
    {
        // TODO: var command = new UpdatePlaylistCommand(id, CurrentUserId, request.Name, request.Description, request.IsPublic);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<PlaylistResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // DELETE api/playlist/{id}
    // Xóa playlist (chỉ chủ sở hữu)
    // =============================================
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // TODO: var command = new DeletePlaylistCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa playlist"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // POST api/playlist/{id}/tracks
    // Thêm track vào playlist
    // =============================================
    [HttpPost("{id:guid}/tracks")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddTrack(Guid id, [FromBody] AddTrackRequest request)
    {
        // TODO: var command = new AddTrackToPlaylistCommand(id, CurrentUserId, request.MediaId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã thêm track vào playlist"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // DELETE api/playlist/{id}/tracks/{mediaId}
    // Xóa track khỏi playlist
    // =============================================
    [HttpDelete("{id:guid}/tracks/{mediaId:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> RemoveTrack(Guid id, Guid mediaId)
    {
        // TODO: var command = new RemoveTrackFromPlaylistCommand(id, CurrentUserId, mediaId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa track khỏi playlist"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──
public record CreatePlaylistRequest(string Name, string? Description, bool IsPublic = true);
public record UpdatePlaylistRequest(string? Name, string? Description, bool? IsPublic);
public record AddTrackRequest(Guid MediaId);

public record PlaylistResponse(
    Guid Id, string Name, string? Description,
    bool IsPublic, int TrackCount, DateTime CreatedAt,
    Guid OwnerId, string OwnerName);

public record PlaylistDetailResponse(
    Guid Id, string Name, string? Description, bool IsPublic,
    DateTime CreatedAt, Guid OwnerId, string OwnerName,
    IEnumerable<MediaItemResponse> Tracks);
