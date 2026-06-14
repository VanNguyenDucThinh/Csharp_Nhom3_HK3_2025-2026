using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TuneVault.API.Hubs;

namespace TuneVault.API.Extensions;

/// <summary>
/// Extension methods đăng ký tất cả services cho TuneVault.API layer.
/// Gọi từ Program.cs: builder.Services.AddWebApiServices(builder.Configuration)
/// </summary>
public static class HostingExtensions
{
    public static IServiceCollection AddWebApiServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── CORS ──────────────────────────────────────────────────────────
        // AllowCredentials bắt buộc cho SignalR WebSocket
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost:5173",   // Vite dev server
                        "http://localhost:3000")   // CRA fallback
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials(); // bắt buộc cho SignalR
            });
        });

        // ── JWT Authentication ────────────────────────────────────────────
        var jwtSection = configuration.GetSection("JwtSettings");
        var secretKey = Encoding.UTF8.GetBytes(
            jwtSection["Secret"]
            ?? throw new InvalidOperationException("JwtSettings:Secret is missing in configuration"));

        services
            .AddAuthentication(opts =>
            {
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opts =>
            {
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey         = new SymmetricSecurityKey(secretKey),
                    ValidateIssuer           = true,
                    ValidIssuer              = jwtSection["Issuer"],
                    ValidateAudience         = true,
                    ValidAudience            = jwtSection["Audience"],
                    ValidateLifetime         = true,
                    ClockSkew                = TimeSpan.Zero // không cho phép trễ thêm
                };

                // SignalR cần đọc token từ query string vì WebSocket không hỗ trợ header
                opts.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        var token = ctx.Request.Query["access_token"].ToString();
                        var path  = ctx.HttpContext.Request.Path;

                        if (!string.IsNullOrEmpty(token) &&
                            path.StartsWithSegments("/notificationHub"))
                        {
                            ctx.Token = token;
                        }

                        return Task.CompletedTask;
                    }
                };
            });

        services.AddAuthorization();

        // ── SignalR ───────────────────────────────────────────────────────
        services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true; // bật trong dev; tắt trong prod
        });

        // ── SignalR Notification Pusher (dùng bởi Infrastructure layer) ──
        services.AddScoped<INotificationPusher, SignalRNotificationPusher>();

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

        // ── Swagger / OpenAPI ─────────────────────────────────────────────
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title       = "TuneVault API",
                Version     = "v1",
                Description = """
                    RESTful API cho nền tảng Media Streaming TuneVault.
                    
                    **Xác thực:** Sử dụng JWT Bearer token. Đăng nhập qua POST /api/auth/login
                    rồi nhấn nút "Authorize" và nhập token để test các endpoint cần auth.
                    
                    **SignalR Hub:** Kết nối real-time tại /notificationHub
                    """,
                Contact = new OpenApiContact
                {
                    Name = "TuneVault Team",
                }
            });

            // Cho phép nhập JWT Bearer token trong Swagger UI
            var securityScheme = new OpenApiSecurityScheme
            {
                Name         = "Authorization",
                Type         = SecuritySchemeType.Http,
                Scheme       = "Bearer",
                BearerFormat = "JWT",
                In           = ParameterLocation.Header,
                Description  = "Nhập JWT token (không cần gõ 'Bearer ' phía trước)"
            };
            options.AddSecurityDefinition("Bearer", securityScheme);

            var securityRequirement = new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id   = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            };
            options.AddSecurityRequirement(securityRequirement);

            // Include XML comments nếu có
            // var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            // var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            // options.IncludeXmlComments(xmlPath);
        });

        // ── HttpClient cho Anthropic API (AI feature) ─────────────────────
        // Đăng ký tại đây; Implementation (AnthropicService) ở Infrastructure layer
        services.AddHttpClient("Anthropic", client =>
        {
            client.BaseAddress = new Uri("https://api.anthropic.com/");
            client.DefaultRequestHeaders.Add("anthropic-version", "2023-06-01");
        });

        return services;
    }
}