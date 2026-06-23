using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface ITrackAlbumRepository
{
    public Task<bool> AddTrackAlbum(Guid idAlbum, Guid idTrack);
    public Task<bool> DeleteTrackAlbum(Guid idAlbum,Guid idTrack);
    public Task<List<MediaItem>> GetMediaItemByAlbumId(Guid idAlbum);

}
