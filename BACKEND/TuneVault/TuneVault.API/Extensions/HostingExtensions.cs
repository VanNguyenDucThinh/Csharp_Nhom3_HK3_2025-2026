using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using TuneVault.API.Hubs;
using TuneVault.API.Services;
using TuneVault.Application.Interface;

namespace TuneVault.API.Extensions;

/// <summary>
/// Extension đăng ký toàn bộ services cho TuneVault.API layer.
/// </summary>
public static class HostingExtensions
{
    public static IServiceCollection AddWebApiServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── CORS ──────────────────────────────────────────────────────────
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost:5173",  // Vite dev server
                        "http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials(); // bắt buộc cho SignalR
            });
        });

        // ── ICurrentUserService ───────────────────────────────────────────
        // Implement interface từ Application layer — đọc UserId từ HttpContext
        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, CurrentUserService>();

        // ── SignalR ───────────────────────────────────────────────────────
        services.AddSignalR();

        // INotificationService → SignalR pusher (dùng bởi Application Event Handlers)
        // TODO: services.AddScoped<INotificationService, SignalRNotificationService>();

        // ── Controllers ───────────────────────────────────────────────────
        services.AddControllers()
            .AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.PropertyNamingPolicy =
                    System.Text.Json.JsonNamingPolicy.CamelCase;
                opts.JsonSerializerOptions.DefaultIgnoreCondition =
                    System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            });

        services.AddEndpointsApiExplorer();

        // ── Swagger ───────────────────────────────────────────────────────
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title       = "TuneVault API",
                Version     = "v1",
                Description = """
                    RESTful API cho nền tảng Media Streaming TuneVault.
                    Đăng nhập tại POST /api/auth/login → copy Token → nhấn Authorize → nhập token.
                    SignalR Hub real-time: /notificationHub
                    """
            });

            // JWT Bearer trong Swagger UI
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name         = "Authorization",
                Type         = SecuritySchemeType.Http,
                Scheme       = "Bearer",
                BearerFormat = "JWT",
                In           = ParameterLocation.Header,
                Description  = "Nhập JWT token "
            });

            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                {
                new OpenApiSecuritySchemeReference("Bearer"),
                [] 
                }
            });
        });

        // ── HttpClient Anthropic (AI feature) ────────────────────────────
        services.AddHttpClient("Anthropic", client =>
        {
            client.BaseAddress = new Uri("https://api.anthropic.com/");
            client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");
        });      
        return services;
    }
}