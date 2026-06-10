using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class AlbumRepository : IAlbumRepository
    {
        private readonly IDbConnectionGen _connectionGen;
        public AlbumRepository(IDbConnectionGen connectionGen)
        {
            _connectionGen = connectionGen;
        }

        public async Task<bool> CreateAlbum(Album album)
        {
            string sql = @"insert into Album(Title, ReleaseDate, CoverImageUrl, ArtistId)
                           values (@Title , @ReleaseDate , @CoverImageUrl , @ArtistId)";
            using var connection = _connectionGen.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Title = album.Title,
                ReleaseDate = album.ReleaseDate,
                CoverImageUrl = album.CoverImageUrl,
                ArtistId = album.ArtistId
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> DeleteAlbum(Guid albumId)
        {
            string sql = @"delete from Album
                           where IdAlbum = @AlbumId";
            using var connection = _connectionGen.CreateConnection();
            var command = new CommandDefinition(sql , new
            {
                AlbumId = albumId
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        public async Task<bool> UpdateAlbum(Album album)
        {
            string sql = @"update Album
                           set Title = @Title,
                               CoverImageUrl = @CoverImageUrl
                               where IdAlbum = @IdAlbum";
            using var connection = _connectionGen.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                Title = album.Title,
                CoverImageUrl = album.CoverImageUrl,
                IdAlbum = album.IdAlbum
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
