using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Application.UseCases.Query;
using TuneVault.Domain.Enums;

namespace TuneVault.API.Controllers;

/// <summary>
/// B5 — Upload &amp; Streaming Media (1.0đ)
/// Chức năng 3 — Thư viện Media (upload)
/// Chức năng 4 — Audio Player (stream + lịch sử phát)
/// Chức năng 5 — Video Player (stream với Range header)
/// Chức năng 7 — Tìm kiếm media
/// </summary>
[Authorize]
public class MediaController : BaseApiController
{
    private static readonly string[] AllowedAudio = [".mp3", ".wav", ".flac", ".aac", ".ogg"];
    private static readonly string[] AllowedVideo = [".mp4", ".webm", ".mkv"];

    // POST api/media/upload
    /// <summary>Upload file audio hoặc video — Chức năng 3 (B5)</summary>
    /// <remarks>
    /// Hỗ trợ audio: mp3, wav, flac, aac, ogg | video: mp4, webm, mkv.
    /// Controller rút ruột IFormFile → truyền Stream xuống UploadMediaCommand.
    /// Handler (Infrastructure) gọi IFileStorageService.UploadFileAsync() lưu file.
    /// </remarks>
    [HttpPost("upload")]
    [RequestSizeLimit(500 * 1024 * 1024)] // 500MB
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload([FromForm] UploadMediaRequest request)
    {
        if (request.File is null || request.File.Length == 0)
            return BadRequest(ApiResponse.Fail("File không được để trống"));

        var allowed = AllowedAudio.Concat(AllowedVideo).ToArray();
        var ext = Path.GetExtension(request.File.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(ApiResponse.Fail(
                $"Định dạng không hỗ trợ. Chấp nhận: {string.Join(", ", allowed)}"));

        // Phân loại MediaStyle dựa vào ContentType
        var mediaStyle = request.File.ContentType.StartsWith("video/")
            ? MediaStyle.Video
            : MediaStyle.Audio;

        // Rút ruột IFormFile → truyền stream xuống Application layer
        await using var stream = request.File.OpenReadStream();

        var command = new UploadMediaCommand(
            title:       request.Title,
            ownerId:     CurrentUserId,
            description: request.Description ?? string.Empty,
            mediaStyle:  mediaStyle,
            category:    request.Category,
            filename:    request.File.FileName,
            contenttype: request.File.ContentType,
            filestream:  stream);

        var success = await Mediator.Send(command);

        return success
            ? StatusCode(StatusCodes.Status201Created, ApiResponse.Ok("Upload thành công"))
            : BadRequest(ApiResponse.Fail("Upload thất bại"));
    }

    // GET api/media/{id}
    /// <summary>Lấy thông tin chi tiết một media item</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<AudioMediaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        // AudioQuery → AudioQueryHandler: lấy media + artist
        var query = new AudioQuery(id);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<AudioMediaDto>.Ok(result));
    }

    // GET api/media/{id}/stream
    /// <summary>Stream audio/video — hỗ trợ Range header cho video seek (B5)</summary>
    /// <remarks>
    /// Trả về 200 OK (audio) hoặc 206 Partial Content (video với Range header).
    /// Frontend video player phải gửi Range header để seek được.
    /// </remarks>
    [HttpGet("{id:guid}/stream")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status206PartialContent)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Stream(Guid id)
    {
        // Chờ GetMediaStreamQuery từ Application layer.
        // Khi có: lấy stream → File(stream, contentType, enableRangeProcessing: true) cho video seek.
        return StatusCode(501, ApiResponse.Fail("Chờ GetMediaStreamQuery"));
    }

    // GET api/media/search?q=keyword
    /// <summary>Tìm kiếm media theo tên — Chức năng 7</summary>
    [HttpGet("search")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<List<MediaDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(ApiResponse.Fail("Từ khóa tìm kiếm không được trống"));

        // SearchMediaQuery(title) → SearchMediaQueryHandler → IMediaItemRepository.GetMediaItemByTitle
        var query = new SearchMediaQuery(q);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<List<MediaDto>>.Ok(result));
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────

/// <summary>Dữ liệu upload media</summary>
public record UploadMediaRequest
{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    public string Title { get; init; } = string.Empty;

    [System.ComponentModel.DataAnnotations.StringLength(1000)]
    public string? Description { get; init; }

    /// <summary>Thể loại: 0=Pop, 1=Rock, 2=Jazz, v.v. (theo Domain.Enums.Category)</summary>
    public Category Category { get; init; }

    [System.ComponentModel.DataAnnotations.Required]
    public IFormFile? File { get; init; }
}