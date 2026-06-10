using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IPlayHistoryRepository
{
    Task<bool> CreatePlayHistory(PlayHistory playHistory);//Tạo mới lịch sử phát
    Task<MediaItem> AddMediaItem(Guid playHistoryId, Guid mediaItemId);//Thêm bài hát vào lịch sử phát
    Task<bool> DeletePlayHistory(Guid playHistoryId);//Xóa lịch sử phát theo ID
    Task<IEnumerable<PlayHistory>> GetPlayHistoryByUserId(Guid userId);//Lấy lịch sử phát của người dùng theo ID

}
