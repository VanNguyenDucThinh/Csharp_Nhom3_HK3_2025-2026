using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Application.UseCases.PlayList.Handler;
using TuneVault.Domain.Enums;

namespace TuneVault.API.Controllers;

public class PlaylistController : BaseApiController
{
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<PlayListDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyPlaylists()
    {
        var query = new GetPlayListQuery(CurrentUserId);
        var result = await Mediator.Send(query);

        return Ok(ApiResponse<List<PlayListDto>>.Ok(result, "Lấy PlayList của tôi thành công"));
    }

    [HttpGet("{id:guid}")]//khi bấm vào playlist thì hiện ra danh sách 
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetTrackPlayListQuery(id);
        var result = await Mediator.Send(query);

        if (result == null)
        {
            return NotFound(ApiResponse.Fail("Playlist không tồn tại"));
        }

        return Ok(ApiResponse<PlayListDto>.Ok(result, "Lấy chi tiết playlist thành công"));
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromForm] CreatePlaylistRequest request)
    {
        string? fileName=request.File?.FileName;
        string? fileContentType=request.File?.ContentType;
        Stream? fileStream=request.File != null ? request.File.OpenReadStream() : null;
        var command = new CreatePlayListCommand(
            request.Name,
            request.IsPublic,
            CurrentUserId,
            fileName,
            fileContentType,
            fileStream);

        var result = await Mediator.Send(command);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<PlayListDto>.Ok(result, "Tạo playlist thành công"));
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<PlayListDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdatePlaylistRequest request)
    {
        string? fileName=request.file?.FileName;
        string? fileContentType=request.file?.ContentType;
        Stream? fileStream=request.file != null ? request.file.OpenReadStream() : null;
        var command = new UpdatePlayListCommand(CurrentUserId, id, request.Name, request.IsPublic, fileName, fileContentType, fileStream);
        var result = await Mediator.Send(command);

        if (!result)
        {
            return NotFound(ApiResponse.Fail("Playlist không tồn tại"));
        }

        return Ok(ApiResponse.Ok(result, "Cập nhật playlist thành công"));
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var query = new DeletePlayListComman(id);
        var result = await Mediator.Send(query);
        if (!result)
        {
           return BadRequest(ApiResponse.Fail("Không thể xóa playlist"));    
        }
        return Ok(ApiResponse.Ok("Xóa thành công"));

    }

    [HttpPost("{id:guid}/tracks")]
    [Authorize]
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

    [HttpDelete("{id:guid}/tracks/{mediaId:guid}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveTrack([FromRoute]Guid id, [FromRoute]Guid mediaId)
    {
        var command = new RemoveTrackFromPlaylistCommand(id,mediaId);
        var result = await Mediator.Send(command);
        if (!result)
        {
            return BadRequest(ApiResponse.Fail("Không thể xóa bài hát"));
        }
        return Ok(ApiResponse.Ok("Xóa thành công"));
    }
}


public record CreatePlaylistRequest{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    public string Name{get; set;}

    public PlayListStatus IsPublic{get; set;}
    public IFormFile? File { get; set; }
};

public record UpdatePlaylistRequest{
    [System.ComponentModel.DataAnnotations.StringLength(200, MinimumLength = 1)]
    public string? Name{get; set;}

    public PlayListStatus IsPublic{get; set;}
    public IFormFile? file{get; set;}
};

public record AddTrackRequest{
    [System.ComponentModel.DataAnnotations.Required]
    public Guid MediaId{get; set;}
};