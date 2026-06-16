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
    /// <summary>Upload file audio hoặc video kèm ảnh bìa — Chức năng 3 (B5)</summary>
    /// <remarks>
    /// Nhận thông tin qua Form-data bao gồm file media chính và ảnh bìa (coverImage) tùy chọn.
    /// </remarks>
    [HttpPost("upload")]
    [Consumes("multipart/form-data")] // Khai báo rõ ràng kiểu dữ liệu để Swagger UI hiển thị đúng form upload
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadFile(
        [FromForm] IFormFile mediaFile, 
        [FromForm] IFormFile? coverImage, // Ảnh bìa có thể null nếu người dùng không upload
        [FromForm] string title,
        [FromForm] string description,
        [FromForm] string category)
    {
        if (mediaFile == null || mediaFile.Length == 0)
            return BadRequest(ApiResponse.Fail("File media không được để trống"));

        var command = new UploadMediaCommand 
        {
            // Map thông tin dữ liệu của File Media chính
            FileName = mediaFile.FileName,
            ContentType = mediaFile.ContentType,
            ContentStream = mediaFile.OpenReadStream(),

            // Map thông tin dữ liệu của Ảnh bìa (Kiểm tra nếu có ảnh mới truyền Stream)
            ImageFileName = coverImage?.FileName,
            ImageContentType = coverImage?.ContentType,
            ImageStream = coverImage?.OpenReadStream(),

            Title = title,
            Description = description,
            Category = category
        };

        // Sử dụng Mediator (viết hoa) được thừa kế sẵn từ BaseApiController thay vì _mediator
        var result = await Mediator.Send(command); 
        
        // Bọc kết quả bằng ApiResponse.Ok để đồng bộ format dữ liệu trả về với toàn bộ hệ thống
        return Ok(ApiResponse.Ok(result, "Tải tệp tin lên hệ thống thành công"));
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