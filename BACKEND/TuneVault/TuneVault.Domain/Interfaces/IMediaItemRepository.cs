using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IMediaItemRepository
{
    Task<bool> CreateMediaItem(MediaItem mediaItem);//Tạo mới bài hát
    Task<bool> UpdateMediaItem(MediaItem mediaItem);//Cập nhật thông tin bài hát
    Task<bool> DeleteMediaItem(Guid mediaItemId);//Xóa bài hát theo ID
    Task<MediaItem> GetMediaItemById(Guid mediaItemId);//Lấy thông tin bài hát theo ID
    Task<List<MediaItem>> GetMediaItemByTitle(string title);//Lấy list bài hát

}
