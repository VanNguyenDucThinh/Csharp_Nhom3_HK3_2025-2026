using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Media.Command;
using TuneVault.Application.UseCases.Media.Handler;
using TuneVault.Application.UseCases.Audio.Command;
using TuneVault.Application.UseCases.Audio.Handler;
using TuneVault.Application.UseCases.Video.Command;
using TuneVault.Application.UseCases.Video.Handler;
using TuneVault.Application.UseCases.Favorite.Command;
using TuneVault.Application.UseCases.Favorite.Handler;
using TuneVault.Application.UseCases.SearchAndTrending.Command;
using TuneVault.Domain.Enums;
using TuneVault.Domain.Interfaces;
namespace TuneVault.API.Controllers;

/// <summary>
/// B5 — Upload &amp; Streaming Media (1.0đ)
/// Chức năng 3 — Thư viện Media (upload)
/// Chức năng 4 — Audio Player (stream + lịch sử phát)
/// Chức năng 5 — Video Player (stream với Range header)
/// Chức năng 7 — Tìm kiếm media
/// </summary>
public class MediaController : BaseApiController
{
    private readonly ICurentUserService _currentUserService;

    // Inject ICurrentUserService vào Controller
    public MediaController(ICurentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }
    private static readonly string[] AllowedAudio = [".mp3", ".wav", ".flac", ".aac", ".ogg"];
    private static readonly string[] AllowedVideo = [".mp4", ".webm", ".mkv"];

    // POST api/media/upload
    /// <summary>Upload file audio hoặc video kèm ảnh bìa — Chức năng 3 (B5)</summary>
    /// <remarks>
    /// Nhận thông tin qua Form-data bao gồm file media chính và ảnh bìa (coverImage) tùy chọn.
    /// </remarks>
    [Authorize]
    [HttpPost("upload")]
    [Consumes("multipart/form-data")] // Khai báo rõ ràng kiểu dữ liệu để Swagger UI hiển thị đúng form upload
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadFile(
        IFormFile mediaFile, 
        IFormFile? coverImage, // Ảnh bìa có thể null nếu người dùng không upload
        [FromForm] string title,
        [FromForm] string artist,
        [FromForm] string description,
        [FromForm] string category)
    {
        if (mediaFile == null || mediaFile.Length == 0)
            return BadRequest(ApiResponse.Fail("File media không được để trống"));
        var parsedCategory = Enum.TryParse<Category>(category, true, out var c) ? c : Category.Pop;
        var mediaStyle = mediaFile.ContentType.StartsWith("video/") ? MediaStyle.Video : MediaStyle.Audio;
        var userId = _currentUserService.UserId;
        var command = new UploadMediaCommand(
            title, 
            artist,
            userId, // Đã có ownerId chuẩn xác từ service
            description, 
            mediaStyle, 
            parsedCategory, 
            mediaFile.FileName, 
            mediaFile.ContentType, 
            mediaFile.OpenReadStream(), 
            coverImage?.FileName, 
            coverImage?.ContentType, 
            coverImage?.OpenReadStream() 
        );

        // Sử dụng Mediator (viết hoa) được thừa kế sẵn từ BaseApiController thay vì _mediator
        var result = await Mediator.Send(command); 
        
        // Bọc kết quả bằng ApiResponse.Ok để đồng bộ format dữ liệu trả về với toàn bộ hệ thống
        return Ok(ApiResponse.Ok(result, "Tải tệp tin lên hệ thống thành công"));
    }

    // GET api/media/{id}
    /// <summary>Lấy thông tin chi tiết một media item</summary>
    [HttpGet("Audio/{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<AudioMediaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
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
    [HttpGet("Video/{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status206PartialContent)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Video(Guid id)
    {
        var query = new GetVideoQuery(id);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<VideoDto>.Ok(result));
    }

    // GET api/media/search?q=keyword
    /// <summary>Tìm kiếm media theo tên — Chức năng 7</summary>
    [HttpGet("search")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<SearchTrendingDto>), StatusCodes.Status200OK)] // Đổi type trả về thành SearchTrendingDto
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Search(
        [FromQuery] string? q,  
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var query = new SearchAndTrendingQuery
        {
            Title = q,
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var result = await Mediator.Send(query);

        return Ok(ApiResponse<SearchTrendingDto>.Ok(result));
    }
    [HttpGet("trend")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<SearchTrendingDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Trend( 
        [FromQuery] int pageNumber = 1, 
        [FromQuery] int pageSize = 10)
    {
        var query = new GetTrendingCommand
        {
            PageNumber = pageNumber,
            PageSize = pageSize
        };

        var result = await Mediator.Send(query);

        return Ok(ApiResponse<SearchTrendingDto>.Ok(result));
    }
    [HttpPost("favorite/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<FavoriteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Favorite(Guid id)
    {

        var command = new ToggleFavoriteCommand(id);
        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Message));

        return Ok(ApiResponse<FavoriteDto>.Ok(result, result.Message));
    }
    [HttpPut("unfavorite/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<FavoriteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UnFavorite(Guid id)
    {

        var command = new ToggleFavoriteCommand(id);
        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Message));

        return Ok(ApiResponse<FavoriteDto>.Ok(result, result.Message));

    }
    [HttpGet("ListFavorite")]
    [ProducesResponseType(typeof(ApiResponse<List<MediaDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFavorite() // Bỏ tham số Guid id đi cho bảo mật
    {
        // 1. Đã đổi Command thành Query theo đúng chuẩn CQRS
        var query = new GetFavoriteCommand(); 
        
        // Gửi qua MediatR (Lưu ý: Thường các project dùng _mediator thay vì Mediator viết hoa)
        var result = await Mediator.Send(query);

        // 2. Sửa lại kiểu trả về là một List<MediaDto>
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