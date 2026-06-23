using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly IDbConnectionGen _connection;
        public FavoriteRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }
        

        public async Task<bool> AddToFavorites(Favorite favorite)
        {
            string sql = @"insert into Favorite(IdUser , IdMediaItem, FavoriteAt)
                           values(@IdUser , @IdMediaItem , @FavoriteAt)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdUser = favorite.IdUser,
                IdMediaItem = favorite.IdMediaItem,
                FavoriteAt = favorite.FavoritedAt
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<IEnumerable<MediaItem>> GetFavoriteTracks(Guid userId)
        {
            string sql = @"select med.*
                           from Favorite f
                           inner join MediaItems med
                           on f.IdMediaItem = med.Id
                           where f.IdUser = @userId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql , new
            {
                UserId = userId
            });
            return await connection.QueryAsync<MediaItem>(command);
        }

        public async Task<bool> IsFavoriteMedia(Guid userId, Guid mediaItemId)
        {
            string sql = @"select count(1) 
                           from Favorite 
                           where IdUser = @IdUser and IdMediaItem = @IdMediaItem";
                           
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdUser = userId,
                IdMediaItem = mediaItemId
            });
            
            int count = await connection.ExecuteScalarAsync<int>(command);
            
            return count > 0; 
        }
        public async Task<bool> RemoveFromFavorites(Guid userId, Guid mediaItemId)
        {
            string sql = @"delete from Favorite
                           where IdUser = @IdUser and IdMediaItem = @IdMediaItem";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdUser = userId,
                IdMediaItem = mediaItemId,
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
