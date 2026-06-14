using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

/// <summary>
/// B4 — JWT Authentication &amp; Authorization (0.5đ)
/// Xử lý đăng ký, đăng nhập, đăng xuất.
/// </summary>
public class AuthController : BaseApiController
{
    // =====================================================================
    // POST api/auth/register
    // Đăng ký tài khoản mới
    // =====================================================================
    /// <summary>Đăng ký tài khoản mới</summary>
    /// <remarks>
    /// Tạo tài khoản với username, email và password.
    /// Password phải tối thiểu 6 ký tự.
    /// </remarks>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<RegisterResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ", errors));
        }

        // TODO: var command = new RegisterCommand(request.Username, request.Email, request.Password);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return CreatedAtAction(nameof(Register), ApiResponse<RegisterResponse>.Ok(result, "Đăng ký thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/auth/login
    // Đăng nhập, trả về JWT token
    // =====================================================================
    /// <summary>Đăng nhập</summary>
    /// <remarks>
    /// Xác thực với email và password. Trả về JWT Bearer token.
    /// Token hết hạn sau 60 phút (cấu hình trong JwtSettings).
    /// </remarks>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);
            return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ", errors));
        }

        // TODO: var command = new LoginCommand(request.Email, request.Password);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<LoginResponse>.Ok(result, "Đăng nhập thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/auth/refresh
    // Làm mới token (tuỳ chọn, dùng refresh token)
    // =====================================================================
    /// <summary>Làm mới access token bằng refresh token</summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
    {
        // TODO: var command = new RefreshTokenCommand(request.RefreshToken);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<LoginResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =====================================================================
    // POST api/auth/logout
    // Đăng xuất — JWT stateless, client xóa token
    // =====================================================================
    /// <summary>Đăng xuất</summary>
    /// <remarks>
    /// JWT là stateless nên client chịu trách nhiệm xóa token.
    /// Nếu dùng refresh token, server sẽ revoke ở đây.
    /// </remarks>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout()
    {
        // TODO: var command = new LogoutCommand(CurrentUserId);
        // TODO: await Mediator.Send(command); // revoke refresh token nếu có
        return Ok(ApiResponse.Ok("Đăng xuất thành công"));
    }

    // =====================================================================
    // POST api/auth/change-password
    // Đổi mật khẩu
    // =====================================================================
    /// <summary>Đổi mật khẩu</summary>
    [HttpPost("change-password")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ"));

        // TODO: var command = new ChangePasswordCommand(CurrentUserId, request.CurrentPassword, request.NewPassword);
        // TODO: await Mediator.Send(command);
        // TODO: return Ok(ApiResponse.Ok("Đổi mật khẩu thành công"));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }
}

// ── Request / Response DTOs ────────────────────────────────────────────────

/// <summary>Dữ liệu đăng ký tài khoản</summary>
public record RegisterRequest(
    /// <example>johndoe</example>
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.StringLength(50, MinimumLength = 3)]
    string Username,

    /// <example>john@example.com</example>
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.EmailAddress]
    string Email,

    /// <example>P@ssw0rd!</example>
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.StringLength(100, MinimumLength = 6)]
    string Password
);

/// <summary>Dữ liệu đăng nhập</summary>
public record LoginRequest(
    /// <example>john@example.com</example>
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.EmailAddress]
    string Email,

    /// <example>P@ssw0rd!</example>
    [property: System.ComponentModel.DataAnnotations.Required]
    string Password
);

public record RefreshTokenRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    string RefreshToken
);

public record ChangePasswordRequest(
    [property: System.ComponentModel.DataAnnotations.Required]
    string CurrentPassword,

    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.StringLength(100, MinimumLength = 6)]
    string NewPassword
);

public record RegisterResponse(Guid UserId, string Username, string Email, DateTime CreatedAt);

public record LoginResponse(
    string Token,
    string TokenType,
    DateTime ExpiresAt,
    string? RefreshToken,
    UserSummaryDto User
);

public record UserSummaryDto(Guid Id, string Username, string Email, string? AvatarUrl);
