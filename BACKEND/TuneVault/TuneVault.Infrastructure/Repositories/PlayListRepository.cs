using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class PlayListRepository : IPlayListRepository
    {
        private readonly IDbConnectionGen _connection;
        public PlayListRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> CreatePlayList(PlayList playList)
        {
            string sql = @"insert into PlayList([Name] , [Owner] , IsPublic , CreateDate)
                           values(@Name , @Owner , @IsPublic ,@CreateDate)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Name = playList.Name,
                Owner = playList.Owner,
                IsPublic = playList.IsPublic,
                CreateDate = playList.CreatedDate
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> DeletePlayList(Guid playListId)
        {
            string sql = @"Delete from PlayList
                           where Id = @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Id = playListId
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> UpdatePlayList(PlayList playList)
        {
            string sql = @"update PlayList
                           set [Name] = @Name,
                               IsPublic = @IsPublic
                           where Id=@Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Name = playList.Name,
                IsPublic = playList.IsPublic,
                Id = playList.Id
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
