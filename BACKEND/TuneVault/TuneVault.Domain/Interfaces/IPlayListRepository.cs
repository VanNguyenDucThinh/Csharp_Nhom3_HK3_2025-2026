using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IPlayListRepository
{
    Task<bool> CreatePlayList(PlayList playList);//Tạo mới danh sách phát
    Task<bool> UpdatePlayList(PlayList playList);//Cập nhật thông tin danh sách phát
    Task<bool> DeletePlayList(Guid playListId);//Xóa danh sách phát theo ID
    Task<PlayList> GetPlayListById(Guid playListId);//Lấy thông tin playlist
    Task<List<PlayList>> GetPlayListByTitle(string title, int skip, int take);

}
