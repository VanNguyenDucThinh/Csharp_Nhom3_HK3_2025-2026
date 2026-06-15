using Dapper;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class MediaItemRepository : IMediaItemRepository
    {
        private readonly IDbConnectionGen _connection;
        public MediaItemRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> CreateMediaItem(MediaItem mediaItem) //tạo bài hát
        {
            string sql = @"Insert into MediaItem(Title, CategoryId, MediaStyleId, UrlMediaItem, Description)
                           values (@Title, @CategoryId , @MediaStyleId, @UrlMediaItem, @Description)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Title = mediaItem.Title,
                CategoryId = mediaItem.Category,
                MediaStyleId = mediaItem.MediaStyle,
                UrlMediaItem = mediaItem.UrlMediaItem,
                Description = mediaItem.Description
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> DeleteMediaItem(Guid mediaItemId) //xóa bài hát
        {
            string sql = @"Delete from MediaItem
                           where Id=@Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new {Id=mediaItemId});
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<MediaItem> GetMediaItemById(Guid mediaItemId) //Lấy thông tin bài hát theo Id
        {
            string sql = @"Select [Id], [Title], [Description], [CategoryId], [Duration], [MediaStyleId], [UrlMediaItem],[OwnerMediaItem],[UploadDateMediaItem]
                           from MediaItem
                           where [Id] = @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new {Id = mediaItemId});
            return await connection.QueryFirstOrDefaultAsync<MediaItem>(command);
        }

        public async Task<bool> UpdateMediaItem(MediaItem mediaItem) // Cập nhật bài hát
        {
            string sql = @"Update MediaItem
                           set [Title] = @Title,
                               [Description] = @Description
                               [CategoryId] = @CategoryId
                               [MediaStyleId] =@MediaStyleId
                               where [Id]= @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, mediaItem);
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
