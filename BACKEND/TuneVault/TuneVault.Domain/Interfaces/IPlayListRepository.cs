using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IPlayListRepository
{
    Task<bool> CreatePlayList(PlayListEntities playList);//Tạo mới danh sách phát
    Task<bool> UpdatePlayList(PlayListEntities playList);//Cập nhật thông tin danh sách phát
    Task<bool> DeletePlayList(Guid playListId);//Xóa danh sách phát theo ID
    Task<List<PlayListEntities>> GetPlayListForMe(Guid owner);
    Task<PlayListEntities> GetPlayListById(Guid playListId);//Lấy thông tin playlist
    Task<List<PlayListEntities>> GetPlayListByTitle(string title, int skip, int take);
    Task<PlayListEntities> GetPlayListPublic(Guid playListId);

}
