using System.Net;
using System.Text.Json;
using TuneVault.API.Common;

namespace TuneVault.API.Middlewares;

/// <summary>
/// Middleware bắt toàn bộ exception chưa được xử lý.
/// Trả về ApiResponse chuẩn hóa thay vì stack trace.
/// Thêm các custom exception từ Application layer vào switch expression khi team làm xong.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        _next   = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception on {Method} {Path}: {Message}",
                context.Request.Method,
                context.Request.Path,
                ex.Message);

            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        // Map exception type → HTTP status + message
        // Uncomment từng case khi Application layer hoàn thành và export custom exceptions
        var (statusCode, message, errors) = exception switch
        {
            UnauthorizedAccessException =>
                (HttpStatusCode.Forbidden, "Không có quyền thực hiện thao tác này", (IEnumerable<string>?)null),

            // NotFoundException e =>
            //     (HttpStatusCode.NotFound, e.Message, null),

            // ValidationException e =>
            //     (HttpStatusCode.BadRequest, "Dữ liệu không hợp lệ", e.Errors.Select(x => x.ErrorMessage)),

            // ConflictException e =>
            //     (HttpStatusCode.Conflict, e.Message, null),

            // ForbiddenException e =>
            //     (HttpStatusCode.Forbidden, e.Message, null),

            OperationCanceledException =>
                (HttpStatusCode.ServiceUnavailable, "Yêu cầu bị hủy", null),

            _ => (HttpStatusCode.InternalServerError,
                  "Đã xảy ra lỗi, vui lòng thử lại sau",
                  null)
        };

        context.Response.StatusCode = (int)statusCode;

        var response = errors is null
            ? ApiResponse.Fail(message)
            : ApiResponse.Fail(message, errors);

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}