using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;
using TuneVault.Infrastructure.DataDapper;

namespace TuneVault.Infrastructure.Repositories
{
    public class ArtistRepository : IArtistRepository
    {
        private readonly IDbConnectionGen _connection;
        public ArtistRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> CreateArtist(Artist artist)
        {
            string sql = @"insert into Artist(IdUserProfile , NameArtist, IsVerified)
                           values(@IdUserProfile, @NameArtist, @IsVerified)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql , new
            {
                IdUserProfile = artist.IdUserProfile,
                NameArtist = artist.NameArtist,
                IsVerified = artist.IsVerified
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> DeleteArtist(Guid id)
        {
            string sql = @"delete from Artist
                           where Id = @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Id = id
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<Artist> GetArtistById(Guid id)
        {
            string sql = @"Select [Id], NameArtist, IdUserProfile, IsVerified
                           from Artist
                           where Id = @Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Id = id
            });
            return await connection.QuerySingleOrDefaultAsync<Artist>(command);
        }

        public async Task<bool> UpdateArtist(Artist artist)
        {
            string sql = @"update Artist
                           set NameArtist=@NameArtist
                               IsVerified=@IsVerified
                           where Id=@Id";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Id = artist.Id,
                NameArtist = artist.NameArtist
            }); 
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
