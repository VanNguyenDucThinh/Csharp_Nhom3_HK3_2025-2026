using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// B5 — Upload &amp; Streaming Media (Audio + Video) (1.0đ)
/// Chức năng 3 — Thư viện Media
/// Chức năng 4 — Audio Player (stream + play history)
/// Chức năng 5 — Video Player (stream với Range header)
/// Chức năng 7 — Tìm kiếm &amp; Khám phá
/// Chức năng 10 — Tương tác (like/favorite, lịch sử nghe)
/// </summary>
[Authorize]
public class MediaController : BaseApiController
{
    private static readonly string[] AllowedAudioExtensions = [".mp3", ".wav", ".flac", ".aac", ".ogg"];
    private static readonly string[] AllowedVideoExtensions = [".mp4", ".webm", ".mkv"];

    // =====================================================================
    // POST api/media/upload
    // Upload file audio hoặc video (multipart/form-data)
    // =====================================================================
    /// <summary>Upload file audio hoặc video</summary>
    /// <remarks>
    /// Hỗ trợ audio: mp3, wav, flac, aac, ogg.
    /// Hỗ trợ video: mp4, webm, mkv.
    /// Kích thước tối đa: 500MB.
    /// </remarks>
    [HttpPost("upload")]
    [RequestSizeLimit(500 * 1024 * 1024)] // 500MB
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse<MediaItemResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Upload([FromForm] UploadMediaRequest request)
    {
        if (request.File is null || request.File.Length == 0)
            return BadRequest(ApiResponse.Fail("File không được để trống"));

        var allowed = AllowedAudioExtensions.Concat(AllowedVideoExtensions).ToArray();
        var ext = Path.GetExtension(request.File.FileName).ToLowerInvariant();

        if (!allowed.Contains(ext))
            return BadRequest(ApiResponse.Fail(
                $"Định dạng không hỗ trợ. Chấp nhận: {string.Join(", ", allowed)}"));

        if (string.IsNullOrWhiteSpace(request.Title))
            return BadRequest(ApiResponse.Fail("Tiêu đề không được để trống"));

        // TODO: var command = new UploadMediaCommand(
        //     OwnerId:     CurrentUserId,
        //     Title:       request.Title,
        //     Description: request.Description,
        //     Artist:      request.Artist,
        //     File:        request.File,
        //     Thumbnail:   request.Thumbnail,
        //     IsPublic:    request.IsPublic);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return CreatedAtAction(nameof(GetById), new { id = result.Id },
        //     ApiResponse<MediaItemResponse>.Ok(result, "Upload thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/media/{id}
    // Lấy thông tin chi tiết một media item
    // =====================================================================
    /// <summary>Lấy thông tin chi tiết một media item</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<MediaItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // TODO: var query = new GetMediaByIdQuery(id, CurrentUserIdOrNull);
        // TODO: var result = await Mediator.Send(query);
        // TODO: if (result is null) return NotFound(ApiResponse.Fail("Không tìm thấy media"));
        // TODO: return Ok(ApiResponse<MediaItemResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/media/{id}/stream
    // Stream audio/video — hỗ trợ Range header cho video seek (B5)
    // =====================================================================
    /// <summary>Stream audio/video — hỗ trợ HTTP Range cho video seek</summary>
    /// <remarks>
    /// Trả về 200 OK cho audio (full).
    /// Trả về 206 Partial Content cho video khi có Range header.
    /// Frontend video player cần gửi Range header để seek được.
    /// </remarks>
    [HttpGet("{id:guid}/stream")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status206PartialContent)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Stream(Guid id)
    {
        // TODO: var query = new GetMediaStreamQuery(id);
        // TODO: var streamInfo = await Mediator.Send(query);
        // TODO: if (streamInfo is null) return NotFound(ApiResponse.Fail("Không tìm thấy media"));

        // Hỗ trợ Range request cho video seek (B5 — "hỗ trợ Range header cho video")
        // var rangeHeader = Request.Headers.Range.ToString();
        // if (!string.IsNullOrEmpty(rangeHeader))
        //     return File(streamInfo.Stream, streamInfo.ContentType, enableRangeProcessing: true);
        // return File(streamInfo.Stream, streamInfo.ContentType);

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/media
    // Lấy danh sách media của người dùng hiện tại
    // =====================================================================
    /// <summary>Lấy danh sách media của tôi</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<MediaItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyMedia(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null) // "audio" | "video"
    {
        if (page < 1) page = 1;
        if (pageSize is < 1 or > 100) pageSize = 10;

        // TODO: var query = new GetMyMediaQuery(CurrentUserId, page, pageSize, type);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/media/public?page=1&pageSize=10&type=audio
    // Lấy danh sách media công khai (khám phá / trending)
    // =====================================================================
    /// <summary>Khám phá media công khai — Chức năng 7</summary>
    [HttpGet("public")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<MediaItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPublicMedia(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null,
        [FromQuery] string? sortBy = "newest") // "newest" | "popular"
    {
        // TODO: var query = new GetPublicMediaQuery(page, pageSize, type, sortBy);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/media/search?q=tên bài&page=1&type=audio
    // Tìm kiếm media theo tên, nghệ sĩ — Chức năng 7
    // =====================================================================
    /// <summary>Tìm kiếm media theo tên bài, nghệ sĩ — Chức năng 7</summary>
    [HttpGet("search")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<MediaItemResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null) // "audio" | "video"
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(ApiResponse.Fail("Từ khóa tìm kiếm không được trống"));

        // TODO: var query = new SearchMediaQuery(q, page, pageSize, type);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // PUT api/media/{id}
    // Cập nhật thông tin media (chỉ chủ sở hữu)
    // =====================================================================
    /// <summary>Cập nhật thông tin media — chỉ chủ sở hữu</summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<MediaItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateMediaRequest request)
    {
        // TODO: var command = new UpdateMediaCommand(id, CurrentUserId, request.Title, request.Description, request.IsPublic);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<MediaItemResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // DELETE api/media/{id}
    // Xóa media (chỉ chủ sở hữu)
    // =====================================================================
    /// <summary>Xóa media — chỉ chủ sở hữu</summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        // TODO: var command = new DeleteMediaCommand(id, CurrentUserId);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã xóa media"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/media/{id}/favorite
    // Like / unlike media (toggle) — Chức năng 10
    // =====================================================================
    /// <summary>Like / Unlike media (toggle) — Chức năng 10</summary>
    [HttpPost("{id:guid}/favorite")]
    [ProducesResponseType(typeof(ApiResponse<FavoriteToggleResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ToggleFavorite(Guid id)
    {
        // TODO: var command = new ToggleFavoriteCommand(CurrentUserId, id);
        // TODO: var isFavorited = await Mediator.Send(command);
        // TODO: var msg = isFavorited ? "Đã thêm vào yêu thích" : "Đã bỏ yêu thích";
        // TODO: return Ok(ApiResponse<FavoriteToggleResponse>.Ok(new(id, isFavorited), msg));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/media/favorites
    // Lấy danh sách media đã yêu thích
    // =====================================================================
    /// <summary>Lấy danh sách media đã yêu thích — Chức năng 10</summary>
    [HttpGet("favorites")]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<MediaItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFavorites(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        // TODO: var query = new GetFavoritesQuery(CurrentUserId, page, pageSize);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/media/{id}/play-history
    // Ghi lại lịch sử nghe (gọi khi bắt đầu phát) — Chức năng 4, 10
    // =====================================================================
    /// <summary>Ghi nhận lượt phát — gọi khi người dùng bắt đầu nghe/xem</summary>
    [HttpPost("{id:guid}/play-history")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RecordPlayHistory(Guid id)
    {
        // TODO: var command = new RecordPlayHistoryCommand(CurrentUserId, id);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok());

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/media/history?limit=10
    // Lấy lịch sử nghe gần nhất — Chức năng 10
    // =====================================================================
    /// <summary>Lấy 10 bài nghe/xem gần nhất — Chức năng 10</summary>
    [HttpGet("history")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<MediaItemResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPlayHistory([FromQuery] int limit = 10)
    {
        if (limit is < 1 or > 50) limit = 10;

        // TODO: var query = new GetPlayHistoryQuery(CurrentUserId, limit);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<IEnumerable<MediaItemResponse>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──────────────────────────────────────────────────────────────────

public record UploadMediaRequest
{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    public string Title { get; init; } = string.Empty;

    [System.ComponentModel.DataAnnotations.StringLength(1000)]
    public string? Description { get; init; }

    [System.ComponentModel.DataAnnotations.StringLength(200)]
    public string? Artist { get; init; }

    [System.ComponentModel.DataAnnotations.Required]
    public IFormFile? File { get; init; }

    public IFormFile? Thumbnail { get; init; }

    public bool IsPublic { get; init; } = true;
}

public record UpdateMediaRequest(
    [property: System.ComponentModel.DataAnnotations.StringLength(200)]
    string? Title,

    [property: System.ComponentModel.DataAnnotations.StringLength(1000)]
    string? Description,

    bool? IsPublic
);

public record MediaItemResponse(
    Guid Id,
    string Title,
    string? Description,
    string? Artist,
    string MediaType,     // "audio" | "video"
    string FileUrl,
    string? ThumbnailUrl,
    int DurationSeconds,
    bool IsPublic,
    bool IsFavorited,     // true nếu user hiện tại đã like
    int PlayCount,
    DateTime CreatedAt,
    Guid OwnerId,
    string OwnerName,
    string? OwnerAvatarUrl
);

public record FavoriteToggleResponse(Guid MediaId, bool IsFavorited);

public record PagedResult<T>(
    IEnumerable<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);