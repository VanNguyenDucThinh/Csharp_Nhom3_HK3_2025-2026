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
    /// Lấy UserId từ JWT claim. Ném UnauthorizedAccessException nếu không có.
    /// </summary>
    protected Guid CurrentUserId
    {
        get
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier)
                      ?? User.FindFirstValue("sub");

            if (sub is null || !Guid.TryParse(sub, out var id))
                throw new UnauthorizedAccessException("Không xác định được người dùng hiện tại.");

            return id;
        }
    }
}