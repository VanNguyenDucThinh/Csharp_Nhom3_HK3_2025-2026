using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Application.UseCases.PlayList.Handler;
using TuneVault.Domain.Enums;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 6 — Playlist CRUD + quản lý track
/// </summary>
[Authorize]
public class PlaylistController : BaseApiController
{
    // GET api/playlist
    /// <summary>Lấy danh sách playlist của tôi</summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<PlayListDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyPlaylists()
    {
        var query = new GetPlayListQuery(CurrentUserId);
        var result = await Mediator.Send(query);

        return Ok(ApiResponse<List<PlayListDto>>.Ok(result, "Lấy PlayList của tôi thành công"));
    }

    // GET api/playlist/{id}
    /// <summary>Xem chi tiết playlist kèm danh sách track</summary>
    [HttpGet("{id:guid}")]
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

    // POST api/playlist
    /// <summary>Tạo playlist mới — Chức năng 6</summary>
    /// <remarks>
    /// Gọi CreatePlayListCommand(name, isPublic, owner).
    /// Owner = CurrentUserId lấy từ JWT.
    /// </remarks>
    [HttpPost]
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

    // PUT api/playlist/{id}
    /// <summary>Cập nhật playlist — chỉ chủ sở hữu</summary>
    [HttpPut("{id:guid}")]
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

        if (result == null)
        {
            return NotFound(ApiResponse.Fail("Playlist không tồn tại"));
        }

        return Ok(ApiResponse<PlayListDto>.Ok(result, "Cập nhật playlist thành công"));
    }

    // DELETE api/playlist/{id}
    /// <summary>Xóa playlist — chỉ chủ sở hữu</summary>
    [HttpDelete("{id:guid}")]
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

    // POST api/playlist/{id}/tracks
    /// <summary>Thêm track vào playlist — Chức năng 6</summary>
    /// <remarks>
    /// Gọi AddTrackToPlaylistCommand(idTrack, idPlayList).
    /// Handler kiểm tra: chủ playlist, track tồn tại, chưa có trong playlist.
    /// </remarks>
    [HttpPost("{id:guid}/tracks")]
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

    // DELETE api/playlist/{id}/tracks/{mediaId}
    /// <summary>Xóa track khỏi playlist — Chức năng 6</summary>
    [HttpDelete("{id:guid}/tracks/{mediaId:guid}")]
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

//Request DTOs 

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