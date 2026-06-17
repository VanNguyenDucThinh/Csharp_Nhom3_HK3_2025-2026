using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Auth.Command;

namespace TuneVault.API.Controllers;

/// <summary>
/// B4 — JWT Authentication (0.5đ) | Chức năng 1 — Xác thực
/// </summary>
public class AuthController : BaseApiController
{
    // POST api/auth/register
    /// <summary>Đăng ký tài khoản mới</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var command = new RegisterCommand(
            request.Name,
            request.Email,
            request.Password);

        var result = await Mediator.Send(command);
        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<AuthResponseDto>.Ok(result, "Đăng ký thành công"));
    }

    // POST api/auth/login
    /// <summary>Đăng nhập — trả về JWT token</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand(request.Email, request.Password);
        var result = await Mediator.Send(command);
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Đăng nhập thành công"));
    }

    // POST api/auth/logout
    /// <summary>Đăng xuất — JWT stateless, client xóa token</summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    public IActionResult Logout()
    {
        // JWT stateless: client tự xóa token
        // Nếu sau này có refresh token thì gọi command revoke ở đây
        return Ok(ApiResponse.Ok("Đăng xuất thành công"));
    }
}

// ── Request DTOs (API layer — không để lộ Command trực tiếp) ──────────────

/// <summary>Dữ liệu đăng ký tài khoản</summary>
public record RegisterRequest{
    /// <example>Nguyễn Văn A</example>
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(30, MinimumLength = 1)]
    public string Name{get; set;}

    /// <example>example@email.com</example>
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.EmailAddress]
    public string Email{get; set;}

    /// <example>Password123</example>
    [System.ComponentModel.DataAnnotations.Required]
    [System.ComponentModel.DataAnnotations.StringLength(100, MinimumLength = 8)]
    public string Password{get; set;}
};

/// <summary>Dữ liệu đăng nhập</summary>
public record LoginRequest(
    /// <example>example@email.com</example>
    [property: System.ComponentModel.DataAnnotations.Required]
    [property: System.ComponentModel.DataAnnotations.EmailAddress]
    string Email,

    /// <example>Password123</example>
    [property: System.ComponentModel.DataAnnotations.Required]
    string Password
);