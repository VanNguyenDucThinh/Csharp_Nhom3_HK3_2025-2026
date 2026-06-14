using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TuneVault.API.Controllers;

/// <summary>
/// Base controller cho toàn bộ TuneVault API.
/// Cung cấp: ISender (MediatR), CurrentUserId, CurrentUserName.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    private ISender? _mediator;

    /// <summary>
    /// Lazy-resolve ISender từ DI — không inject qua constructor để tránh
    /// constructor bloat ở mọi controller con.
    /// </summary>
    protected ISender Mediator =>
        _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    /// <summary>
    /// UserId của người dùng đang đăng nhập (lấy từ JWT claim "sub" hoặc NameIdentifier).
    /// Throws InvalidOperationException nếu endpoint không có [Authorize] mà vẫn gọi.
    /// </summary>
    protected Guid CurrentUserId
    {
        get
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");

            if (string.IsNullOrEmpty(claim) || !Guid.TryParse(claim, out var id))
                throw new InvalidOperationException(
                    "CurrentUserId chỉ dùng được trong endpoint có [Authorize]. " +
                    "Kiểm tra JWT claim 'sub' hoặc 'NameIdentifier'.");

            return id;
        }
    }

    /// <summary>
    /// Username của người dùng hiện tại (từ JWT claim "name" hoặc "unique_name").
    /// </summary>
    protected string CurrentUserName =>
        User.FindFirstValue(ClaimTypes.Name)
        ?? User.FindFirstValue("name")
        ?? "Unknown";

    /// <summary>
    /// Trả về true nếu người dùng đã xác thực (có JWT hợp lệ).
    /// Dùng trong endpoint [AllowAnonymous] để phân biệt guest vs logged-in.
    /// </summary>
    protected bool IsAuthenticated => User.Identity?.IsAuthenticated == true;

    /// <summary>
    /// Lấy CurrentUserId an toàn — trả về null nếu chưa đăng nhập.
    /// Dùng trong endpoint [AllowAnonymous].
    /// </summary>
    protected Guid? CurrentUserIdOrNull
    {
        get
        {
            var claim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                     ?? User.FindFirstValue("sub");
            return Guid.TryParse(claim, out var id) ? id : null;
        }
    }
}