using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using TuneVault.Domain.Interfaces;
using TuneVault.Infrastructure.FileStorage;
using TuneVault.Infrastructure.Repositories;
using TuneVault.Infrastructure.Security;
using TuneVault.Infrastructure.Services.JWT;
using TuneVault.Infrastructure.SignalR;
using TuneVault.Infrastructure.DataDapper;

namespace TuneVault.Infrastructure
{
    public static class DependecyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddJWT(configuration);
            services.AddScoped<IDbConnection>(sp =>
                new SqlConnection(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IFavoriteRepository, FavoriteRepository>();
            services.AddScoped<IFollowRepository, FollowRepository>();
            services.AddScoped<ITokenGenerator, TokenGenerator>();
            services.AddScoped<IMediaItemRepository, MediaItemRepository>();
            services.AddScoped<IMediaShareRepository, MediaShareRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<IPasswordHash, PasswordHasher>();
            services.AddScoped<IPlayHistoryRepository, PlayHistoryRepository>();
            services.AddScoped<IPlayListRepository , PlayListRepository>();
            services.AddScoped<IPlayListTrackRepository, PlayListTrackRepository>();
            services.AddScoped<IUserProfileRepository, UserRepository>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddSignalR();
            services.AddHttpContextAccessor();
            services.AddScoped<ICurentUserService, CurrenUserService>();

            services.AddScoped<ITokenRepository, TokenRepository>();
            services.AddScoped<IDbConnectionGen, DbConnectionGen>();
            return services;
        }
    }
}
