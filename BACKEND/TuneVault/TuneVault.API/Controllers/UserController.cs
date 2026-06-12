using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

[Authorize]
public class UserController : BaseApiController
{
    // =============================================
    // GET api/user/profile
    // Xem profile của chính mình
    // =============================================
    [HttpGet("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyProfile()
    {
        // TODO: var query = new GetMyProfileQuery(CurrentUserId);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<UserProfileResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // GET api/user/{id}
    // Xem profile người dùng khác
    // =============================================
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        // TODO: var query = new GetUserByIdQuery(id);
        // TODO: var result = await Mediator.Send(query);
        // TODO: if (result is null) return NotFound(ApiResponse.Fail("Không tìm thấy người dùng"));
        // TODO: return Ok(ApiResponse<UserProfileResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // PUT api/user/profile
    // Cập nhật profile (tên, bio)
    // =============================================
    [HttpPut("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        // TODO: var command = new UpdateProfileCommand(CurrentUserId, request.Username, request.Bio);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<UserProfileResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // PUT api/user/avatar
    // Upload ảnh đại diện
    // =============================================
    [HttpPut("avatar")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateAvatar(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse.Fail("File không hợp lệ"));

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(ApiResponse.Fail("Chỉ chấp nhận jpg, jpeg, png, webp"));

        // TODO: var command = new UpdateAvatarCommand(CurrentUserId, file);
        // TODO: var avatarUrl = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<string>.Ok(avatarUrl, "Cập nhật avatar thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // POST api/user/{id}/follow
    // Follow một người dùng
    // =============================================
    [HttpPost("{id:guid}/follow")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Follow(Guid id)
    {
        // TODO: var command = new FollowUserCommand(CurrentUserId, id);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã follow"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // DELETE api/user/{id}/follow
    // Unfollow một người dùng
    // =============================================
    [HttpDelete("{id:guid}/follow")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Unfollow(Guid id)
    {
        // TODO: var command = new UnfollowUserCommand(CurrentUserId, id);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã unfollow"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──
public record UserProfileResponse(Guid Id, string Username, string Email,
    string? AvatarUrl, string? Bio, int FollowerCount, int FollowingCount);
public record UpdateProfileRequest(string? Username, string? Bio);
