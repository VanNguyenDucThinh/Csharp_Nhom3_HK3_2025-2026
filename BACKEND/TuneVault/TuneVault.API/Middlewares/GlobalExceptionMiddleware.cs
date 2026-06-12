using System.Net;
using System.Text.Json;
using TuneVault.API.Common;

namespace TuneVault.API.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
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
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message) = exception switch
        {
            // TODO: thêm custom exceptions từ Application layer khi team làm xong
            // UnauthorizedAccessException => (HttpStatusCode.Forbidden, "Không có quyền thực hiện"),
            // NotFoundException e => (HttpStatusCode.NotFound, e.Message),
            // ValidationException e => (HttpStatusCode.BadRequest, e.Message),
            _ => (HttpStatusCode.InternalServerError, "Đã xảy ra lỗi, vui lòng thử lại")
        };

        context.Response.StatusCode = (int)statusCode;

        var response = ApiResponse.Fail(message);
        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
