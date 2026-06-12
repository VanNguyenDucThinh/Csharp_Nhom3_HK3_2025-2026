using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;

namespace TuneVault.API.Controllers;

public class AuthController : BaseApiController
{
    // =============================================
    // POST api/auth/register
    // Đăng ký tài khoản mới
    // =============================================
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<RegisterResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // TODO: var command = new RegisterCommand(request.Username, request.Email, request.Password);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return CreatedAtAction(nameof(Register), ApiResponse<RegisterResponse>.Ok(result));

        // Placeholder — xóa khi Application layer hoàn thành
        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // POST api/auth/login
    // Đăng nhập, trả về JWT token
    // =============================================
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<LoginResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // TODO: var command = new LoginCommand(request.Email, request.Password);
        // TODO: var result = await Mediator.Send(command);
        // TODO: return Ok(ApiResponse<LoginResponse>.Ok(result));

        return StatusCode(501, ApiResponse.Fail("Chờ Application layer"));
    }

    // =============================================
    // POST api/auth/logout
    // Đăng xuất (invalidate token phía client)
    // =============================================
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        // JWT là stateless — client xóa token
        // Nếu dùng refresh token thì revoke ở đây
        return Ok(ApiResponse.Ok("Đăng xuất thành công"));
    }
}

// ── Request / Response DTOs (tạm đặt đây, sau chuyển sang Application/DTOs) ──

public record RegisterRequest(string Username, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record RegisterResponse(Guid UserId, string Username, string Email);
public record LoginResponse(string Token, string TokenType, DateTime ExpiresAt, UserDto User);
public record UserDto(Guid Id, string Username, string Email, string? AvatarUrl);
