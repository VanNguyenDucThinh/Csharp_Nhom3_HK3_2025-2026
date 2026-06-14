using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// B3 / Chức năng 2 — Hồ sơ người dùng
/// Xem/sửa profile, avatar, bio, follow/unfollow.
/// </summary>
[Authorize]
public class UserController : BaseApiController
{
    // =====================================================================
    // GET api/user/profile
    // Xem profile của chính mình
    // =====================================================================
    /// <summary>Lấy profile của người dùng hiện tại</summary>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMyProfile()
    {
        // TODO: var query = new GetMyProfileQuery(CurrentUserId);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<UserProfileResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/user/{id}
    // Xem profile người dùng khác (public)
    // =====================================================================
    /// <summary>Lấy profile của người dùng theo ID</summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
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

    // =====================================================================
    // GET api/user/search?q=keyword&page=1&pageSize=10
    // Tìm kiếm người dùng theo tên
    // =====================================================================
    /// <summary>Tìm kiếm người dùng theo tên hoặc email</summary>
    [HttpGet("search")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<UserSummaryDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SearchUsers(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(ApiResponse.Fail("Từ khóa tìm kiếm không được trống"));

        // TODO: var query = new SearchUsersQuery(q, page, pageSize);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<UserSummaryDto>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // PUT api/user/profile
    // Cập nhật profile (tên, bio)
    // =====================================================================
    /// <summary>Cập nhật thông tin profile</summary>
    [HttpPut("profile")]
    [ProducesResponseType(typeof(ApiResponse<UserProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ"));

        // TODO: var command = new UpdateProfileCommand(CurrentUserId, request.Username, request.Bio);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<UserProfileResponse>.Ok(result, "Cập nhật profile thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // PUT api/user/avatar
    // Upload ảnh đại diện
    // =====================================================================
    /// <summary>Upload hoặc thay đổi ảnh đại diện</summary>
    /// <remarks>Chấp nhận: jpg, jpeg, png, webp. Kích thước tối đa 5MB.</remarks>
    [HttpPut("avatar")]
    [RequestSizeLimit(5 * 1024 * 1024)] // 5MB
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateAvatar(IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(ApiResponse.Fail("File không hợp lệ"));

        var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowed.Contains(ext))
            return BadRequest(ApiResponse.Fail("Chỉ chấp nhận jpg, jpeg, png, webp"));

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(ApiResponse.Fail("Kích thước file không được vượt quá 5MB"));

        // TODO: var command = new UpdateAvatarCommand(CurrentUserId, file);
        // TODO: var avatarUrl = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<string>.Ok(avatarUrl, "Cập nhật avatar thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/user/{id}/follow
    // Follow một người dùng
    // =====================================================================
    /// <summary>Theo dõi một người dùng</summary>
    /// <remarks>
    /// Chức năng 10 — Tương tác: Follow người dùng/nghệ sĩ.
    /// Không thể tự follow chính mình.
    /// </remarks>
    [HttpPost("{id:guid}/follow")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Follow(Guid id)
    {
        if (id == CurrentUserId)
            return BadRequest(ApiResponse.Fail("Không thể tự follow chính mình"));

        // TODO: var command = new FollowUserCommand(CurrentUserId, id);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã follow"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // DELETE api/user/{id}/follow
    // Unfollow một người dùng
    // =====================================================================
    /// <summary>Bỏ theo dõi một người dùng</summary>
    [HttpDelete("{id:guid}/follow")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Unfollow(Guid id)
    {
        // TODO: var command = new UnfollowUserCommand(CurrentUserId, id);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đã unfollow"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/user/{id}/followers?page=1&pageSize=20
    // Danh sách người follow user này
    // =====================================================================
    /// <summary>Lấy danh sách người theo dõi</summary>
    [HttpGet("{id:guid}/followers")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<UserSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFollowers(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        // TODO: var query = new GetFollowersQuery(id, page, pageSize);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<UserSummaryDto>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // GET api/user/{id}/following?page=1&pageSize=20
    // Danh sách user này đang follow
    // =====================================================================
    /// <summary>Lấy danh sách người dùng đang theo dõi</summary>
    [HttpGet("{id:guid}/following")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<PagedResult<UserSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFollowing(
        Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        // TODO: var query = new GetFollowingQuery(id, page, pageSize);
        // TODO: var result = await Mediator.Send(query);
        // TODO: return Ok(ApiResponse<PagedResult<UserSummaryDto>>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── DTOs ──────────────────────────────────────────────────────────────────

public record UserProfileResponse(
    Guid Id,
    string Username,
    string Email,
    string? AvatarUrl,
    string? Bio,
    int FollowerCount,
    int FollowingCount,
    bool IsFollowedByCurrentUser,
    DateTime CreatedAt
);

public record UpdateProfileRequest(
    [property: System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 3)]
    string? Username,

    [property: System.ComponentModel.DataAnnotations.StringLength(300)]
    string? Bio
);

// UserSummaryDto dùng chung với AuthController
// public record UserSummaryDto(Guid Id, string Username, string Email, string? AvatarUrl);