using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories;

public class AlbumRepository : IAlbumRepository
{
    private readonly IDbConnectionGen _connection;
    
    public AlbumRepository(IDbConnectionGen connection)
    {
        _connection = connection;
    }
    
    public async Task<bool> CreateAlbum(Album album)
    {
        string sql = @"INSERT INTO Albums (Id, Name, NameArtist, UrlImage, Owner) 
                       VALUES (@Id, @Name, @NameArtist, @UrlImage, @Owner)";
                       
        using var connection = _connection.CreateConnection();
        int rowsAffected = await connection.ExecuteAsync(sql, album);
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteAlbum(Guid id)
    {
        string sql = @"DELETE FROM Albums 
                       WHERE Id = @Id";
                       
        using var connection = _connection.CreateConnection();
        int rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
        return rowsAffected > 0;
    }

    public async Task<Album> GetAlbum(Guid id)
    {
        string sql = @"SELECT Id, Name, NameArtist, UrlImage, Owner 
                       FROM Albums 
                       WHERE Id = @Id";
                       
        using var connection = _connection.CreateConnection();
        return await connection.QueryFirstOrDefaultAsync<Album>(sql, new { Id = id });
    }

    public async Task<bool> UpdateAlbum(Album album)
    {
        string sql = @"UPDATE Albums 
                       SET Name = @Name, 
                           NameArtist = @NameArtist, 
                           UrlImage = @UrlImage,
                           Owner = @Owner 
                       WHERE Id = @Id";
                       
        using var connection = _connection.CreateConnection();
        int rowsAffected = await connection.ExecuteAsync(sql, album);
        return rowsAffected > 0;
    }
    
    public async Task<List<Album>> GetAlbumByTitle(string title, int skip, int take)
    {
        string sql = @"SELECT Id, Name, NameArtist, UrlImage, Owner 
                       FROM Albums 
                       WHERE Name LIKE @Title 
                       ORDER BY Name 
                       OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";

        using var connection = _connection.CreateConnection();
    
        var command = new CommandDefinition(sql, new 
        { 
            Title = $"%{title}%",
            Skip = skip, 
            Take = take 
        });

        var result = await connection.QueryAsync<Album>(command);
    
        return result.ToList();
    }

    public async Task<bool> CheckTrackAlbum(Guid idAlbum, Guid track)
    {
        string sql = @"SELECT COUNT(1) 
                       FROM TrackAlbums 
                       WHERE AlbumId = @IdAlbum AND MediaId = @IdMedia";
                       
        using var connection = _connection.CreateConnection();
        var count = await connection.ExecuteScalarAsync<int>(sql, new { IdAlbum = idAlbum, IdMedia = track });
        
        return count > 0;
    }
}