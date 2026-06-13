using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IPlayHistoryRepository
{
    Task<bool> CreatePlayHistory(PlayHistory playHistory);//lưu lịch sử khi người dùng phát bài hát
    Task<bool> DeletePlayHistory(Guid userId);//Xóa lịch sử phát theo ID
    Task<IEnumerable<PlayHistory>> GetPlayHistoryByUserId(Guid userId);//Lấy lịch sử phát của người dùng theo ID

}
