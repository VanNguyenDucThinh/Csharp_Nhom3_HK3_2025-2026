using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IAlbumRepository
{
    Task<bool> CreateAlbum(Album album);
    Task<bool> DeleteAlbum(Guid id);
    Task<bool> UpdateAlbum(Album album);
    Task<Album> GetAlbum(Guid id);
    Task<List<Album>> GetAlbumByTitle(string title, int skip, int take);
    Task<bool> CheckTrackAlbum(Guid idAlbum, Guid track);

}
