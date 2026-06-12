using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

[Authorize]
public class MediaController : BaseApiController
{
    // =============================================
    // POST api/media/upload
    // Upload file audio hoặc video
    // =============================================
    [HttpPost("upload")]
    [RequestSizeLimit(500 * 1024 * 1024)] // 500MB
    [ProducesResponseType(typeof(ApiResponse<MediaItemResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload([FromForm] UploadMediaRequest request)
    {
        if (request.File is null || request.File.Length == 0)
            return BadRequest(ApiResponse.Fail("File không được để trống"));

        var allowedAudio = new[] { ".mp3", ".wav", ".flac", ".aac", ".ogg" };
        var allowedVideo = new[] { ".mp4", ".webm", ".mkv" };
        var allowed = allowedAudio.Concat(allowedVideo).ToArray();

        var ext = Path.GetExtension(request.File.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(ApiResponse.Fail($"Định dạng không hỗ trợ. Chấp nhận: {string.Join(", ", allowed)}"));

        // TODO: var command = new UploadMediaCommand(CurrentUserId, request.Title, request.File, ...);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return CreatedAtAction(nameof(GetById), new { id = result.Id }, ApiResponse<MediaItemResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/media/{id}
    // Lấy thông tin chi tiết một media item
    // =============================================
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<MediaItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // TODO: var query = new GetMediaByIdQuery(id);
        // TODO: var result = await Mediator.Send(query);
        // TODO: if (result is null) return NotFound(ApiResponse.Fail("Không tìm thấy media"));
        // TODO: return Ok(ApiResponse<MediaItemResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/media/{id}/stream
    // Stream audio/video — hỗ trợ Range header cho video
    // =============================================
    [HttpGet("{id:guid}/stream")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status206PartialContent)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Stream(Guid id)
    {
        // TODO: var query = new GetMediaStreamQuery(id);
        // TODO: var (stream, contentType, fileName) = await Mediator.Send(query);
        // TODO: if (stream is null) return NotFound(ApiResponse.Fail("Không tìm thấy media"));

        // Hỗ trợ Range request cho video seek
        // TODO:
        // var rangeHeader = Request.Headers.Range;
        // if (!string.IsNullOrEmpty(rangeHeader))
        //     return File(stream, contentType, enableRangeProcessing: true);
        // return File(stream, contentType);

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/media?page=1&pageSize=10&type=audio
    // Lấy danh sách media của người dùng hiện tại
    // =============================================
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<MediaItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyMedia(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null) // "audio" | "video"
    {
        // TODO: var query = new GetMyMediaQuery(CurrentUserId, page, pageSize, type);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/media/search?q=tên bài&page=1
    // Tìm kiếm media theo tên, nghệ sĩ
    // =============================================
    [HttpGet("search")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<MediaItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(ApiResponse.Fail("Từ khóa tìm kiếm không được trống"));

        // TODO: var query = new SearchMediaQuery(q, page, pageSize, type);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // PUT api/media/{id}
    // Cập nhật thông tin media (chỉ chủ sở hữu)
    // =============================================
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<MediaItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMediaRequest request)
    {
        // TODO: var command = new UpdateMediaCommand(id, CurrentUserId, request.Title, request.Description);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<MediaItemResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // DELETE api/media/{id}
    // Xóa media (chỉ chủ sở hữu)
    // =============================================
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // TODO: var command = new DeleteMediaCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa media"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // POST api/media/{id}/favorite
    // Like / unlike media (toggle)
    // =============================================
    [HttpPost("{id:guid}/favorite")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ToggleFavorite(Guid id)
    {
        // TODO: var command = new ToggleFavoriteCommand(CurrentUserId, id);
        // TODO: var isFavorited = await Mediator.Send(command);
        // TODO: var msg = isFavorited ? "Đã thêm vào yêu thích" : "Đã bỏ yêu thích";
        // TODO: return Ok(ApiResponse<bool>.Ok(isFavorited, msg));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // POST api/media/{id}/play-history
    // Ghi lại lịch sử nghe (gọi khi bắt đầu phát)
    // =============================================
    [HttpPost("{id:guid}/play-history")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> RecordPlayHistory(Guid id)
    {
        // TODO: var command = new RecordPlayHistoryCommand(CurrentUserId, id);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok());

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/media/history
    // Lấy 10 bài nghe gần nhất
    // =============================================
    [HttpGet("history")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<MediaItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPlayHistory()
    {
        // TODO: var query = new GetPlayHistoryQuery(CurrentUserId, limit: 10);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<IEnumerable<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──
public record UploadMediaRequest
{
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Artist { get; init; }
    public IFormFile? File { get; init; }
    public IFormFile? Thumbnail { get; init; }
    public bool IsPublic { get; init; } = true;
}

public record UpdateMediaRequest(string? Title, string? Description, bool? IsPublic);

public record MediaItemResponse(
    Guid Id, string Title, string? Description, string? Artist,
    string MediaType, string FileUrl, string? ThumbnailUrl,
    int DurationSeconds, bool IsPublic, DateTime CreatedAt,
    Guid OwnerId, string OwnerName);

public record PagedResult<T>(IEnumerable<T> Items, int TotalCount, int Page, int PageSize);
