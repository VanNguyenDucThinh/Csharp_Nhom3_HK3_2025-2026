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

        public async Task<bool> CountView(Guid mediaItemId)
        {
            // Giả sử cột lưu lượt xem trong DB của bạn tên là ViewCount (hoặc thay bằng Views tùy DB)
            string sql = @"Update MediaItems 
                           set ViewCount = ISNULL(ViewCount, 0) + 1 
                           where Id = @Id";

            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Id = mediaItemId });
            int rowsAffected = await connection.ExecuteAsync(command);
            return rowsAffected > 0;
        }

        public async Task<bool> CreateMediaItem(MediaItem mediaItem) //tạo bài hát
        {
            string sql = @"Insert into MediaItems(Id, Title, Artist, Description, Category, MediaStyle, UrlImageMedia, UrlMediaItem, Owner)
               values (@Id, @Title, @Artist, @Description, @Category, @MediaStyle, @UrlImageMedia, @UrlMediaItem, @Owner)";
            using var connection = _connection.CreateConnection();
            // var command = new CommandDefinition(sql, new
            // {
            //     Title = mediaItem.Title,
            //     CategoryId = mediaItem.Category,
            //     MediaStyleId = mediaItem.MediaStyle,
            //     UrlMediaItem = mediaItem.UrlMediaItem,
            //     Description = mediaItem.Description
            // });
            int RowsAffected = await connection.ExecuteAsync(sql,mediaItem);
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

        public async Task<List<MediaItem>> GetAudioByArtist(string nameArtist)
        {
            string sql = @"Select Id, Title, Artist, Description, Category, MediaStyle, UrlImageMedia, ViewCount, UrlMediaItem, Owner, UploadDateMediaItem, IdAlbum
               from MediaItems
               where Artist Like @Artist  AND MediaStyle = 1";
            using var connection = _connection.CreateConnection();
             var command = new CommandDefinition(sql, new
            {
                Artist = $"%{nameArtist}%"
            });
            var result = await connection.QueryAsync<MediaItem>(command);
            return result.ToList();
        }

        public async Task<MediaItem> GetAudioById(Guid mediaItemId)
        {
            string sql = @"Select Id, Title, Artist, Description, Category, MediaStyle, UrlImageMedia, ViewCount, UrlMediaItem, Owner, UploadDateMediaItem, IdAlbum
               from MediaItems
               where Id = @Id AND MediaStyle = 0";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Id = mediaItemId });
            return await connection.QueryFirstOrDefaultAsync<MediaItem>(command);
        }

        public async Task<MediaItem> GetMediaItemById(Guid mediaItemId) //Lấy thông tin bài hát theo Id
        {
            string sql = @"Select Id, Title, Artist, Description, Category, MediaStyle, 
                      UrlImageMedia, ViewCount, UrlMediaItem, Owner
                    from MediaItems
                    where Id = @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new {Id = mediaItemId});
            return await connection.QueryFirstOrDefaultAsync<MediaItem>(command);
        }

        public async Task<List<MediaItem>> GetMediaItemByTitle(string title, int skip, int take)
        {
            string sql = @"Select Id, Title, Artist, Description, Category, MediaStyle, UrlImageMedia, ViewCount, UrlMediaItem, Owner, UploadDateMediaItem, IdAlbum
                           from MediaItems
                           where Title LIKE @Title
                           order by Id
                           offset @Skip rows fetch next @Take rows only";

            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Title = $"%{title}%", // Tìm kiếm chứa từ khóa (Ký tự % của SQL)
                Skip = skip,
                Take = take
            });
            
            var result = await connection.QueryAsync<MediaItem>(command);
            return result.ToList();
        }

        public async Task<MediaItem> GetVideoById(Guid mediaItemId)
        {
            // Giả định: Danh mục Video trong CSDL của bạn có mã Category là 1
            string sql = @"Select Id, Title, Artist, Description, Category, MediaStyle, UrlImageMedia, ViewCount, UrlMediaItem, Owner, UploadDateMediaItem, IdAlbum
                           from MediaItems
                           where Id = @Id AND Category = 1"; 
                           
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Id = mediaItemId });
            return await connection.QueryFirstOrDefaultAsync<MediaItem>(command);
        }

        public async Task<List<MediaItem>> GetViewHigh(int skip, int take)
        {
            string sql = @"Select Id, Title, Artist, Description, Category, MediaStyle, UrlImageMedia, ViewCount, UrlMediaItem, Owner, UploadDateMediaItem, IdAlbum
                           from MediaItems
                           order by ViewCount desc
                           offset @Skip rows fetch next @Take rows only";

            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Skip = skip, Take = take });
            
            var result = await connection.QueryAsync<MediaItem>(command);
            return result.ToList();
        }

        public async Task<bool> UpdateMediaItem(MediaItem mediaItem) // Cập nhật bài hát
        {
            string sql = @"Update MediaItems
               set Title = @Title,
                    Artist = @Artist,
                   Description = @Description,
                   Category = @Category,
                   MediaStyle = @MediaStyle
               where Id = @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, mediaItem);
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
        
    }
}
