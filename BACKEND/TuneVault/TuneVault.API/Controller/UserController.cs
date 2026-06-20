using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.User.Command;
using TuneVault.Application.UseCases.User.Handler;
using TuneVault.Application.UseCases.Follow.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.API.Controllers;

/// <summary>
/// Chức năng 2 — Hồ sơ người dùng (xem/sửa profile, follow/unfollow)
/// </summary>
[Authorize]
public class UserController : BaseApiController
{
    private readonly IFileStorageService _fileStorage;

    public UserController(IFileStorageService fileStorage)
    {
        _fileStorage = fileStorage;
    }

    // GET api/user/profile
    /// <summary>Lấy profile của người dùng hiện tại</summary>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyProfile()
    {
        var query = new GetProfileQuery(CurrentUserId);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<ProfileUserDto>.Ok(result));
    }

    // GET api/user/{id}
    /// <summary>Lấy profile của người dùng khác</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        // GetProfileQuery dùng chung cho cả "xem profile của mình" lẫn "xem profile người khác"
        var query = new GetProfileQuery(id);
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<ProfileUserDto>.Ok(result));
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
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var command = new UpdateProfileCommand(
            request.Name,
            request.AvatarUrl ?? string.Empty,
            request.Bio ?? string.Empty);

        var result = await Mediator.Send(command);
        return Ok(ApiResponse<ProfileUserDto>.Ok(result, "Cập nhật profile thành công"));
    }

    // PUT api/user/avatar
    /// <summary>Upload ảnh đại diện</summary>
    /// <remarks>Chấp nhận: jpg, jpeg, png, webp. Tối đa 5MB.</remarks>
    [HttpPut("avatar")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    [ProducesResponseType(typeof(ApiResponse<ProfileUserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAvatar(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse.Fail("File không hợp lệ"));

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(ApiResponse.Fail("Chỉ chấp nhận jpg, jpeg, png, webp"));

        // Upload ảnh lên storage (dùng chung IFileStorageService với UploadMediaCommandHandler)
        var avatarUrl = await _fileStorage.UploadFileAsync(
            file.OpenReadStream(), file.FileName, "avatar_files", file.ContentType);

        // UpdateProfileCommand ghi đè toàn bộ Name/Bio nên cần lấy lại giá trị hiện tại để giữ nguyên
        var currentProfile = await Mediator.Send(new GetProfileQuery(CurrentUserId));

        var command = new UpdateProfileCommand(currentProfile.Name, avatarUrl, currentProfile.Bio);
        var result = await Mediator.Send(command);

        return Ok(ApiResponse<ProfileUserDto>.Ok(result, "Cập nhật ảnh đại diện thành công"));
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
public record UpdateProfileRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.StringLength(30, MinimumLength = 1)]
    string Name,

    string? AvatarUrl,

    [property: System.ComponentModel.DataAnnotations.StringLength(300)]
    string? Bio
);