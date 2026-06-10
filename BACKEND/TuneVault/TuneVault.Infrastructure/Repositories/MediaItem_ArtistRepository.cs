using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class MediaItem_ArtistRepository : IMediaItem_ArtistRepository
    {
        private readonly IDbConnectionGen _connection;
        public MediaItem_ArtistRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> CreateMediaItemArtist(Guid mediaItemId, Guid artistId)
        {
            string sql = @"insert into MediaItem_Artist(IdMediaItem, IdArtist)
                           values(@MediaItemId , @ArtistId)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                MediaItemId = mediaItemId,
                ArtistId = artistId
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> DeleteMediaItemArtist(Guid mediaItemId, Guid artistId)
        {
            string sql = @"delete from MediaItem_Artist
                           where IdMediaItem = @MediaItemId and IdArtist=@ArtistId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                MediaItemId = mediaItemId,
                ArtistId = artistId
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<IEnumerable<MediaItem>> GetMediaItemsByArtistId(Guid artistId)
        {
            string sql = @"select mi.Id, mi.Title, mi.Duration, mi.UploadDateMediaItem, mi.UrlMediaItem
                           from MediaItem mi
                           inner join MediaItem_Artist mia
                                on mi.Id = mia.IdMediaItem
                           where mia.IdArtist = @ArtistId
                           order by mi.UploadDateMediaItem desc";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                ArtistId = artistId
            });
            return await connection.QueryAsync<MediaItem>(command);
        }
    }
}
