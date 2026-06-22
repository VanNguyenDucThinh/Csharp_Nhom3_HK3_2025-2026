using System.Security.Claims;
using TuneVault.Application.Interface;

namespace TuneVault.API.Services;

/// <summary>
/// Implementation của ICurrentUserService (định nghĩa trong Application layer).
/// Đọc UserId từ JWT claim thông qua IHttpContextAccessor.
/// Đăng ký trong HostingExtensions: services.AddScoped&lt;ICurrentUserService, CurrentUserService&gt;()
///
/// Handler trong Application layer inject ICurrentUserService để lấy UserId
/// mà không cần biết về HttpContext — đúng nguyên tắc Clean Architecture.
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Trả về UserId dạng string từ JWT claim "sub" hoặc NameIdentifier.
    /// Null nếu chưa đăng nhập.
    /// </summary>
    public string? UserId =>
        _httpContextAccessor.HttpContext?.User
            .FindFirstValue(ClaimTypes.NameIdentifier)
        ?? _httpContextAccessor.HttpContext?.User
            .FindFirstValue("sub");
}