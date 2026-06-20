using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class MediaShareRepository : IMediaShareRepository
    {
        private readonly IDbConnectionGen _connection;
        public MediaShareRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }
        

        public async Task<bool> CreateMediaShare(MediaShare mediaShare)
        {
            string sql = @"Insert into MediaShare(IdSender , IdReceiver , IdMediaItem, IdPlayList, ShareAt)
                           values (@IdSender, @IdReceiver, @IdMediaItem, NULL, @ShareAt)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdSender = mediaShare.IdSender,
                IdReceiver = mediaShare.IdReceiver,
                IdMediaItem = mediaShare.IdMediaItem,
                ShareAt = mediaShare.ShareAt,
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected> 0;
        }

    public async Task<List<MediaShare>> GetSharedByIdUser(Guid id)
    {
    // Dùng LEFT JOIN vì một lượt share có thể là MediaItem HOẶC PlayList (cái còn lại sẽ null)
        string sql = @"
            SELECT 
                ms.*, 
                m.*, 
                p.*
                FROM MediaShare ms
                LEFT JOIN MediaItems m ON ms.IdMediaItem = m.Id
                LEFT JOIN PlayList p ON ms.IdPlayList = p.Id
                WHERE ms.IdReceiver = @Id 
                ORDER BY ms.ShareAt DESC";
                       
        using var connection = _connection.CreateConnection();
    
    // Multi-mapping: Ánh xạ 3 bảng (MediaShare, MediaItem, PlayList) trả về 1 object (MediaShare)
        var result = await connection.QueryAsync<MediaShare, MediaItem, PlayListEntities, MediaShare>(
            sql,
            (mediaShare, mediaItems, playList) => 
            {
            // Gán các object con vào object cha
                mediaShare.MediaItem = mediaItems;
                mediaShare.PlayList = playList;
                return mediaShare;
            },
            new { Id = id },
            splitOn: "Id,Id" 
        );
    
        return result.ToList();
    }
    }
}
