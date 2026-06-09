using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IPlayHistoryRepository
{
    Task<bool> AddMediaItemToPlayHistory(PlayHistory playHistoryId);//Thêm bài hát vào lịch sử phát
    Task<bool> DeletePlayHistory(Guid userId);//Xóa lịch sử phát theo IdUser
    Task<IEnumerable<PlayHistory>> GetPlayHistoryByUserId(Guid userId);//Lấy lịch sử phát của người dùng theo ID

}
