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

        public async Task<bool> CreatePlayList(PlayListEntities playList)
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

        public async Task<PlayListEntities> GetPlayListById(Guid playListId)
        {
            string sql = @"select [Id], [Name], [Owner], [IsPublic], [CreateDate]
                           from PlayList
                           where Id = @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Id = playListId });
            return await connection.QueryFirstOrDefaultAsync<PlayListEntities>(command);
        }

        public async Task<List<PlayListEntities>> GetPlayListByTitle(string title, int skip, int take)
        {
            string sql = @"select [Id], [Name], [Owner], [IsPublic], [CreateDate]
                           from PlayList
                           where [Name] LIKE @Title
                           order by CreateDate desc
                           offset @Skip rows fetch next @Take rows only";

            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Title = $"%{title}%", // Tìm kiếm chuỗi gần đúng
                Skip = skip,
                Take = take
            });
            
            var result = await connection.QueryAsync<PlayListEntities>(command);
            return result.ToList();
        }

        public async Task<bool> UpdatePlayList(PlayListEntities playList)
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
