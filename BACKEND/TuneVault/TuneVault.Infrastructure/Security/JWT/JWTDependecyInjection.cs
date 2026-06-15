using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Services.JWT
{
    public static class JWTDependecyInjection
    {
        public static IServiceCollection AddJWT(this IServiceCollection services, IConfiguration configuration)
        {
            //1.JWT setting
            services.Configure<JWTSetting>(configuration.GetSection("JwtSettings")); //lấy thông tin từ appsetting.json JwtSettings
            //2.JWT generator
            services.AddScoped<ITokenGenerator, TokenGenerator>();

            //3.Authentication(JwtBearer)
            var key = configuration["JwtSettings:Secret"] ?? throw new Exception("JWT secret is missing") ; 
            var issuer = configuration["JwtSettings:Issuer"];
            var audience = configuration["JwtSettings:Audience"];

            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; //Mặc định tìm kiếm/giải mã token dạng Bearer
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; //Kiểm tra xem token có hợp lệ(tồn tại) không | nếu không -> 401
            }
            ).AddJwtBearer(option =>  // cấu hình luật
            {
                option.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true, //Hệ thống kiểm tra nguồn gốc phát hành
                    ValidateAudience = true, //dùng cho ứng dụng nào
                    ValidateLifetime = true, //tự động check hết hạn
                    ValidateIssuerSigningKey = true, //kiểm tra tính hợp lệ của chữ ký

                    //giá trị để đối chiếu
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
                    ClockSkew = TimeSpan.Zero // Nếu token hết hạn thì lập tức block
                };

                option.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hub/notifications"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            return services;
        }
    }
}
