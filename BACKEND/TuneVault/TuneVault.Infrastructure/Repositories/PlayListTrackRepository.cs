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
        

        // public async Task<bool> AddTrackToPlaylist(Guid playlistId, Guid mediaItemId)
        // {
        //     string sql = @"insert into PlayListTrack(IdPlaylist , IdMediaItem)
        //                    values (@PlayListId , @MediaItemId)";
        //     using var connection = _connection.CreateConnection();
        //     var command = new CommandDefinition(sql, new
        //     {
        //         PlayListId = playlistId,
        //         MediaItemId = mediaItemId,
        //     });
        //     int RowsAffected = await connection.ExecuteAsync(command);
        //     return RowsAffected > 0;
        // }

        public async Task<bool> AddTrackToPlaylist(PlayListTrack playListTrack)
        {
            string sql = @"insert into PlayListTrack(IdPlaylist, IdMediaItem, AddAt)
                           values (@PlayListId, @MediaItemId, @AddAt)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                PlayListId = playListTrack.IdPlaylist, 
                MediaItemId = playListTrack.IdMediaItem,
                AddAt=playListTrack.AddAt
            });
            int rowsAffected = await connection.ExecuteAsync(command);
            return rowsAffected > 0;
        }

        public async Task<bool> Exists(Guid playlistId, Guid mediaItemId)
        {
            string sql = @"select 1 from PlayListTrack 
                           where IdPlaylist = @PlayListId and IdMediaItem = @MediaItemId";
            
            using var connection = _connection.CreateConnection();
            
            var result = await connection.ExecuteScalarAsync<int?>(sql, new 
            { 
                PlayListId = playlistId, 
                MediaItemId = mediaItemId 
            });
            
            return result != null;
        }

        public async Task<IEnumerable<MediaItem>> GetTracksInPlaylist(Guid playlistId)
        {
            string sql = @"select mi.Id, mi.Title, mi.UrlMediaItem, mi.Owner, mi.Category 
                           from MediaItems mi
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
                PlayListId = playlistId
            });
            return await connection.QueryAsync<MediaItem>(command);
        }

        public async Task<bool> RemoveTrackFromPlaylist(Guid playlistId, Guid mediaItemId)
        {
            string sql = @"delete from PlayListTrack
                           where IdPlaylist = @PlayListId and IdMediaItem = @MediaItemId";
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
