using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IPlayListTrackRepository
{
    Task<bool> AddTrackToPlaylist(Guid playlistId, Guid mediaItemId);//Thêm bài hát vào playlist
    Task<bool> RemoveTrackFromPlaylist(Guid playlistId, Guid mediaItemId);//Xóa bài hát khỏi playlist
    Task<IEnumerable<MediaItem>> GetTracksInPlaylist(Guid playlistId);//Lấy danh sách bài hát trong một playlist theo ID playlist
}
