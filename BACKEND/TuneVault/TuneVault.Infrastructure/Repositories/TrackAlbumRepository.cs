using System;
using Dapper;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Infrastructure.Repositories;

public class TrackAlbumRepository : ITrackAlbumRepository
{
    private readonly IDbConnectionGen _connection;
    public TrackAlbumRepository(IDbConnectionGen connection)
    {
        _connection = connection;
    }

    public async Task<bool> AddTrackAlbum(Guid idAlbum, Guid idTrack)
    {
        string sql = @"INSERT INTO TrackAlbums (IdAlbum, IdMediaItem) 
                       VALUES (@IdAlbum, @IdTrack)";
                       
        using var connection = _connection.CreateConnection();
        int rowsAffected = await connection.ExecuteAsync(sql, new { IdAlbum = idAlbum, IdTrack = idTrack });
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteTrackAlbum(Guid idAlbum, Guid idTrack)
    {
        string sql = @"DELETE FROM TrackAlbums 
                       WHERE IdAlbum = @IdAlbum AND IdMediaItem = @IdTrack";
                       
        using var connection = _connection.CreateConnection();
        int rowsAffected = await connection.ExecuteAsync(sql, new { IdAlbum = idAlbum, IdTrack = idTrack });
        return rowsAffected > 0;
    }
    // Bạn nhớ khai báo hàm này bên trong Interface tương ứng trước nhé
    public async Task<List<MediaItem>> GetMediaItemByAlbumId(Guid idAlbum)
    {
        string sql = @"
            SELECT m.Id, m.Title, m.Artist, m.UrlImageMedia, m.UrlMediaItem
            FROM MediaItems m
            INNER JOIN TrackAlbums ta ON m.Id = ta.IdMediaItem
            WHERE ta.IdAlbum = @IdAlbum";

        using var connection = _connection.CreateConnection();
        var result = await connection.QueryAsync<MediaItem>(sql, new { IdAlbum = idAlbum });
    
        return result.ToList();
    }
}
