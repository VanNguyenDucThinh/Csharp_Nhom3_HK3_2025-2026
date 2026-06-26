using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.User.Command;
using TuneVault.Application.UseCases.User.Handler;
using TuneVault.Application.UseCases.Follow.Command;

namespace TuneVault.API.Controllers;
public class UserController : BaseApiController
{
    [HttpGet("profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyProfile()
    {
        var query = new GetProfileQuery(CurrentUserId);
        var result = await Mediator.Send(query);
        return Ok(new ApiResponse<ProfileUserDto>(result));
    }
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var query = new GetProfileQuery(id);
        var result = await Mediator.Send(query);
        return Ok(new ApiResponse<ProfileUserDto>(result));
    }
    [HttpPut("profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileRequest request)
    {
        string? fileName=request.AvatarUrl?.FileName;
        string? contentType=request.AvatarUrl?.ContentType;
        Stream? fileStream=request.AvatarUrl != null ? request.AvatarUrl.OpenReadStream() : null;

        var command = new UpdateProfileCommand(
            request?.Name,request?.Bio,fileName, contentType, fileStream);

        var result = await Mediator.Send(command);
        return Ok(ApiResponse<ProfileUserDto>.Ok(result, "Cập nhật profile thành công"));
    }
    [HttpPost("{id:guid}/follow")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<FollowDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Follow(Guid id)
    {

        var command = new UserFollowCommand(id);
        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Message));

        return Ok(ApiResponse<FollowDto>.Ok(result, result.Message));
    }
    [HttpDelete("{id:guid}/follow")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<FollowDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Unfollow(Guid id)
    {
        // UserFollowCommand dùng toggle — gọi lại khi đang follow = unfollow
        var command = new UserFollowCommand(id);
        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Message));

        return Ok(ApiResponse<FollowDto>.Ok(result, result.Message));
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────

public record UpdateProfileRequest{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(30, MinimumLength = 1)]
    public string? Name{get; set;}

    public IFormFile? AvatarUrl{get; set;}

    [System.ComponentModel.DataAnnotations.StringLength(300)]
    public string? Bio{get; set;}
};