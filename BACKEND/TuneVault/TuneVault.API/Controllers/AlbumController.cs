using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AlbumController : BaseApiController
{
    private readonly ICurentUserService _curUser;

    public AlbumController(ICurentUserService curUser)
    {
        _curUser = curUser;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAlbum(Guid id)
    {
        var command = new GetAlbumCommand(id);
        var result = await Mediator.Send(command);
        return Ok(ApiResponse.Ok(result, "Lấy thông tin Album thành công"));
    }

    [HttpGet("{idAlbum}/tracks")]
    public async Task<IActionResult> GetTrackAlbum(Guid idAlbum)
    {
        var command = new GetTrackAlbumCommand(idAlbum);
        var result = await Mediator.Send(command);
        return Ok(ApiResponse.Ok(result, "Lấy chi tiết Album thành công"));
    }

    [HttpPost]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateAlbum([FromForm] CreateAlbumRequest request)
    {
        var command = new CreateAlbumCommand(request.Name, request.NameArtist, request.ImageFile?.FileName,request.ImageFile?.ContentType, request.ImageFile?.OpenReadStream());
        var result = await Mediator.Send(command);
        return Ok(ApiResponse.Ok(result, "Tạo Album thành công"));
    }

    [HttpPut("{id}")]
    [Authorize]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateAlbum(Guid id, [FromForm] UpdateAlbumRequest request)
    {
        var command = new UpdateAlbumCommand(
            id,
            request.Name,
            request.NameArtist,
            request.ImageFile?.FileName,
            request.ImageFile?.ContentType,
            request.ImageFile?.OpenReadStream()
        );

        var result = await Mediator.Send(command);
        return Ok(ApiResponse.Ok(result, "Cập nhật Album thành công"));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteAlbum(Guid id)
    {
        var command = new DeleteAlbumCommand(id);
        var result = await Mediator.Send(command);
        return Ok(ApiResponse.Ok(result, "Xóa Album thành công"));
    }

    [HttpPost("tracks")]
    [Authorize]
    public async Task<IActionResult> AddTrackToAlbum([FromBody] AddTrackAlbumCommand command)
    {
        var result = await Mediator.Send(command);
        return Ok(ApiResponse.Ok(result, "Thêm bài hát vào Album thành công"));
    }

    [HttpDelete("{idAlbum}/tracks/{idMedia}")]
    [Authorize]
    public async Task<IActionResult> DeleteTrackFromAlbum(Guid idAlbum, Guid idMedia)
    {
        var command = new DeleteTrackAlbumCommand(idAlbum, idMedia);
        var result = await Mediator.Send(command);
        return Ok(ApiResponse.Ok(result, "Xóa bài hát khỏi Album thành công"));
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────

public record CreateAlbumRequest
{
    public string Name { get; init; }
    public string NameArtist { get; init; } 
    public IFormFile? ImageFile { get; init; }
}

public record UpdateAlbumRequest
{
    public string Name { get; init; } = string.Empty;
    public string NameArtist { get; init; } = string.Empty;
    public IFormFile? ImageFile { get; init; }
}