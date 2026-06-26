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

public class MediaController : BaseApiController
{
    private readonly ICurentUserService _currentUserService;
    public MediaController(ICurentUserService currentUserService)
    {
        _currentUserService = currentUserService;
    }
    private static readonly string[] AllowedAudio = [".mp3", ".wav", ".flac", ".aac", ".ogg"];
    private static readonly string[] AllowedVideo = [".mp4", ".webm", ".mkv"];
    [Authorize]
    [HttpPost("upload")]
    [Authorize]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UploadFile(
        IFormFile mediaFile, 
        IFormFile? coverImage,
        [FromForm] string title,
        [FromForm] string artist,
        [FromForm] string? description,
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
            userId,
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

        var result = await Mediator.Send(command); 
        
        return Ok(ApiResponse.Ok(result, "Tải tệp tin lên hệ thống thành công"));
    }

    [HttpGet("Audio/{id:guid}")]//Này dùng để gọi khi bấm phát âm thanh
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<AudioMediaDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new AudioQuery(id);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<AudioMediaDto>.Ok(result));
    }
    [HttpGet("Video/{id:guid}")]//này dùng gọi để phát video
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
    [HttpPost("favorite/{id:guid}")]
    [Authorize]
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
    [Authorize]
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
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<List<MediaDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFavorite()
    {
        var query = new GetFavoriteCommand(); 
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<List<MediaDto>>.Ok(result));
    }
}


// ── Request DTOs ──────────────────────────────────────────────────────────

public record UploadMediaRequest
{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    public string Title { get; init; } = string.Empty;

    [System.ComponentModel.DataAnnotations.StringLength(1000)]
    public string? Description { get; init; }
    public Category Category { get; init; }
    [System.ComponentModel.DataAnnotations.Required]
    public IFormFile? File { get; init; }
}