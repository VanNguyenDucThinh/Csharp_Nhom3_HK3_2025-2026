using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TuneVault.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public abstract class BaseApiController : ControllerBase
{
    private ISender? _mediator;
    protected ISender Mediator =>
        _mediator ??= HttpContext.RequestServices.GetRequiredService<ISender>();

    /// <summary>
    /// Lấy UserId (string) từ JWT claim — dùng cho ICurrentUserService
    /// </summary>
    protected string? CurrentUserIdString =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User.FindFirstValue("sub");

    /// <summary>
    /// Lấy UserId dạng Guid — dùng khi cần truyền thẳng vào Command/Query
    /// </summary>
    protected Guid CurrentUserId
    {
        get
        {
            var sub = CurrentUserIdString;
            if (sub is null || !Guid.TryParse(sub, out var id))
                throw new UnauthorizedAccessException("Không xác định được người dùng hiện tại.");
            return id;
        }
    }
}