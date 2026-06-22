using System.Net;
using System.Text.Json;
using FluentValidation;
using TuneVault.API.Common;

namespace TuneVault.API.Middlewares;

/// <summary>
/// Bắt toàn bộ exception chưa xử lý → trả ApiResponse chuẩn hóa.
/// ValidationException từ ValidationBehavior (FluentValidation) được map → 400 Bad Request.
/// UnauthorizedAccessException từ AuthorizationBehavior → 403 Forbidden.
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
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

        ApiResponse response;
        int statusCode;

        switch (exception)
        {
            // FluentValidation — ném bởi ValidationBehavior trong Application layer
            case ValidationException ve:
                statusCode = (int)HttpStatusCode.BadRequest;
                var errors = ve.Errors.Select(e => e.ErrorMessage);
                response = ApiResponse.Fail("Dữ liệu không hợp lệ", errors);
                break;

            // AuthorizationBehavior + AddTrackToPlaylistCommandHandler
            case UnauthorizedAccessException ue:
                statusCode = (int)HttpStatusCode.Forbidden;
                response = ApiResponse.Fail(ue.Message);
                break;

            case OperationCanceledException:
                statusCode = (int)HttpStatusCode.ServiceUnavailable;
                response = ApiResponse.Fail("Yêu cầu bị hủy");
                break;

            // Exception("...") từ các Handler (NotFoundException, v.v.)
            // Sau khi Application layer tạo custom exception thì thêm case ở đây
            default:
                statusCode = (int)HttpStatusCode.InternalServerError;
                response = ApiResponse.Fail("Đã xảy ra lỗi, vui lòng thử lại sau");
                break;
        }

        context.Response.StatusCode = statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}