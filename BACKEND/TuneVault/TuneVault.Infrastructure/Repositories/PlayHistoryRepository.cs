using Dapper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class PlayHistoryRepository : IPlayHistoryRepository
    {
        private readonly IDbConnectionGen _connection;
        public PlayHistoryRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> AddMediaItemToPlayHistory(PlayHistory playHistoryId)
        {
            string sql = @"insert into PlayHistory(IdUser, IdMediaItem, PlayAt)
                           values (@IdUser, @IdMediaItem, @PlayAt)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdUser = playHistoryId.IdUser,
                IdMediaItem = playHistoryId.IdMediaItem,
                PlayAt = playHistoryId.PlayAt
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> DeletePlayHistory(Guid userId)
        {
            string sql = @"delete from PlayHistory
                           where IdUser=@IdUser";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                UserId = userId
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<IEnumerable<PlayHistory>> GetPlayHistoryByUserId(Guid userId)
        {
            string sql = @"select * from PlayHistory
                           where IdUser=@IdUser";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdUser = userId
            });
            return await connection.QueryAsync<PlayHistory>(command);
        }
    }
}
