using Dapper;
using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class PlayListTrackRepository : IPlayListTrackRepository
    {
        private readonly IDbConnectionGen _connection;

        public PlayListTrackRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> AddTrackToPlaylist(Guid playlistId, Guid mediaItemId)
        {
            string sql = @"insert into PlayListTrack(IdPlaylist , IdMediaItem)
                           values (@PlayListId , @MediaItemId)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                PlayListId = playlistId,
                MediaItemId = mediaItemId,
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<IEnumerable<MediaItem>> GetTracksInPlaylist(Guid playlistId)
        {
            string sql = @"select mi.Id, mi.Title, mi.Duration, mi.UrlMediaItem 
                           from MediaItem mi
                           inner join PlayListTrack plt
                                 on mi.Id = plt.IdMediaItem
                           where plt.IdPlaylist = @PlayListId";
            //Neu can lay them ten tac gia thi can them 2 bang nua
            //inner join MediaItem_Artist mia
            //on mi.Id = mia.IdMediaItem
            //inner join Artist art
            //on mia.IdArtist = art.Id
            using var connection = _connection.CreateConnection();

            var command = new CommandDefinition(sql, new
            {
                PlaylistId = playlistId,
            });
            return await connection.QueryAsync<MediaItem>(command);
        }

        public async Task<bool> RemoveTrackFromPlaylist(Guid playlistId, Guid mediaItemId)
        {
            string sql = @"delete from PlayListTrack
                           where IdPlaylist = @PlayListId and MediaItemId = @MediaItemId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                PlayListId = playlistId,
                MediaItemId = mediaItemId,
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
