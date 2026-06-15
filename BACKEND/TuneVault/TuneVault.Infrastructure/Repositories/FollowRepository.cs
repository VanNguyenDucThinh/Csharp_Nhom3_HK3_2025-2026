using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class FollowRepository : IFollowRepository
    {
        private readonly IDbConnectionGen _connection;
        public FollowRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> FollowUser(Guid followerId, Guid followeeId)
        {
            string sql = @"insert into Follow(IdFollower, IdFollowing)
                           values (@IdFollower, @IdFollowing)";
            using var connection = _connection.CreateConnection();
            var command= new CommandDefinition(sql , new
            {
                IdFollower= followerId,
                IdFollowing = followeeId,
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<IEnumerable<Guid>> GetFollowing(Guid userId)
        {
            string sql = @"select [IdFollowing]
                           from Follow
                           where [IdFollower] = @userId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                userId = userId
            });
            return await connection.QueryAsync<Guid>(command);
        }

        public async Task<bool> UnfollowUser(Guid followerId, Guid followeeId)
        {
            string sql = @"delete from Follow
                           where IdFollower=@followerId and IdFollowing = @followeeId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                followerId = followerId,
                followeeId = followeeId
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
