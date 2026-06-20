using Dapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
            string sql = @"insert into PlayList([Id], [Name] , [Owner] , IsPublic , CreateDate, [UrlImage])
                           values(@Id, @Name , @Owner , @IsPublic ,@CreateDate, @UrlImage)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Id=playList.Id,
                Name = playList.Name,
                Owner = playList.Owner,
                IsPublic = playList.IsPublic,
                CreateDate = playList.CreatedDate,
                UrlImage=playList.UrlImage
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
            string sql = @"select [Id], [Name], [Owner], [IsPublic], [CreateDate], [UrlImage]
                           from PlayList
                           where Id = @Id AND IsPublic = 1";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Id = playListId });
            return await connection.QueryFirstOrDefaultAsync<PlayListEntities>(command);
        }


        public async Task<List<PlayListEntities>> GetPlayListByTitle(string title, int skip, int take)
        {
            string sql = @"select [Id], [Name], [Owner], [IsPublic], [CreateDate], [UrlImage]
                           from PlayList
                           where [Name] LIKE @Title AND IsPublic = 1
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

        public async Task<List<PlayListEntities>> GetPlayListForMe(Guid owner)
        {
            var sql = @"select [Id], [Name], [Owner], [IsPublic], [CreateDate], [UrlImage]
                   from PlayList
                   where [Owner] = @OwnerId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { OwnerId = owner });
    
            var result = await connection.QueryAsync<PlayListEntities>(command);
            return result.ToList();
        }

        public async Task<bool> UpdatePlayList(PlayListEntities playList)
        {
            string sql = @"update PlayList
                           set [Name] = @Name,
                               IsPublic = @IsPublic,
                               [UrlImage] = @UrlImage
                           where Id=@Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Name = playList.Name,
                IsPublic = playList.IsPublic,
                Id = playList.Id,
                UrlImage=playList.UrlImage
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
