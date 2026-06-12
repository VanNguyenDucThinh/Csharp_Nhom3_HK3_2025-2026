using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class TokenRepository : ITokenRepository
    {
        private readonly IDbConnectionGen _connection;
        public TokenRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> SaveRefreshTokenAsync(RefreshToken token)
        {
            string sql = @"INSERT INTO RefreshToken(Id, UserId, Token, ExpiryDate, IsUsed, IsRevoked)
                           VALUES(@Id, @UserId, @Token, @ExpiryDate, @IsUsed, @IsRevoked)";

            using var connection = _connection.CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(sql, token);

            return rowsAffected > 0;
        }

        public async Task<RefreshToken> GetByTokenAsync(string token)
        {
            string sql = "SELECT * FROM RefreshToken WHERE Token = @Token";
            using var connection = _connection.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<RefreshToken>(sql, new { Token = token });
        }

        public async Task<bool> UpdateTokenAsync(RefreshToken token)
        {
            string sql = @"UPDATE RefreshToken 
                           SET IsUsed = @IsUsed, IsRevoked = @IsRevoked 
                           WHERE Id = @Id";
            using var connection = _connection.CreateConnection();
            var rowsAffected = await connection.ExecuteAsync(sql, token);

            return rowsAffected > 0;
        }
    }
}
