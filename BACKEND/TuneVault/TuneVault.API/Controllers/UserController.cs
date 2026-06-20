using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.User.Command;
using TuneVault.Application.UseCases.User.Handler;
using TuneVault.Application.UseCases.Follow.Command;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 2 — Hồ sơ người dùng (xem/sửa profile, follow/unfollow)
/// </summary>
[Authorize]
public class UserController : BaseApiController
{
    // GET api/user/profile
    /// <summary>Lấy profile của người dùng hiện tại</summary>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyProfile()
    {
        var query = new GetProfileQuery(CurrentUserId);
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    // GET api/user/{id}
    /// <summary>Lấy profile của người dùng khác</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var query = new GetProfileQuery(id);
        var result = await Mediator.Send(query);
        return Ok(result);
    }

    // PUT api/user/profile
    /// <summary>Cập nhật thông tin profile — Chức năng 2</summary>
    /// <remarks>
    /// Gọi UpdateProfileCommand(name, avatarUrl, bio).
    /// Handler lấy userId từ ICurrentUserService (được inject từ HttpContext).
    /// </remarks>
    [HttpPut("profile")]
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

    // POST api/user/{id}/follow
    /// <summary>Follow một người dùng — Chức năng 10</summary>
    [HttpPost("{id:guid}/follow")]
    [ProducesResponseType(typeof(ApiResponse<FollowDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Follow(Guid id)
    {
        if (id == CurrentUserId)
            return BadRequest(ApiResponse.Fail("Không thể tự follow chính mình"));

        var command = new UserFollowCommand(id);
        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Message));

        return Ok(ApiResponse<FollowDto>.Ok(result, result.Message));
    }

    // DELETE api/user/{id}/follow
    /// <summary>Unfollow một người dùng — Chức năng 10</summary>
    [HttpDelete("{id:guid}/follow")]
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

/// <summary>Dữ liệu cập nhật profile</summary>
public record UpdateProfileRequest{
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(30, MinimumLength = 1)]
    public string? Name{get; set;}

    public IFormFile? AvatarUrl{get; set;}

    [System.ComponentModel.DataAnnotations.StringLength(300)]
    public string? Bio{get; set;}
};