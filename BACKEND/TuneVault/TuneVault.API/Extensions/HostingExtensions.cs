using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TuneVault.API.Hubs;

namespace TuneVault.API.Extensions;

public static class HostingExtensions
{
    public static IServiceCollection AddWebApiServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // ── CORS ────────────────────────────────────────────────────────
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy.WithOrigins("http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod()
                      .AllowCredentials();
            });
        });

        // ── JWT ─────────────────────────────────────────────────────────
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = Encoding.UTF8.GetBytes(
            jwtSettings["Secret"] ?? throw new InvalidOperationException("JwtSettings:Secret is missing"));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey         = new SymmetricSecurityKey(secretKey),
                ValidateIssuer           = true,
                ValidIssuer              = jwtSettings["Issuer"],
                ValidateAudience         = true,
                ValidAudience            = jwtSettings["Audience"],
                ValidateLifetime         = true,
                ClockSkew                = TimeSpan.Zero
            };

            // SignalR: đọc token từ query string
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    if (!string.IsNullOrEmpty(accessToken) &&
                        path.StartsWithSegments("/notificationHub"))
                    {
                        context.Token = accessToken;
                    }
                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization();

        // ── SignalR ─────────────────────────────────────────────────────
        services.AddSignalR();

        // ── SignalR Pusher ───────────────────────────────────────────────
        services.AddScoped<INotificationPusher, SignalRNotificationPusher>();

        // ── Controllers ─────────────────────────────────────────────────
        services.AddControllers();
        services.AddEndpointsApiExplorer();

        // ── Swagger ─────────────────────────────────────────────────────
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title   = "TuneVault API",
                Version = "v1"
            });

            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name         = "Authorization",
                Type         = SecuritySchemeType.Http,
                Scheme       = "Bearer",
                BearerFormat = "JWT",
                In           = ParameterLocation.Header,
                Description  = "Nhập: Bearer {token}"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
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
            });
        });

        return services;
    }
}