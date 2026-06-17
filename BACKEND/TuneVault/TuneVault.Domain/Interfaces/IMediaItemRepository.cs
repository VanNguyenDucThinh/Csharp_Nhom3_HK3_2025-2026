using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IMediaItemRepository
{
    Task<bool> CreateMediaItem(MediaItem mediaItem);//Tạo mới bài hát
    Task<bool> UpdateMediaItem(MediaItem mediaItem);//Cập nhật thông tin bài hát
    Task<bool> DeleteMediaItem(Guid mediaItemId);//Xóa bài hát theo ID
    Task<MediaItem> GetAudioById(Guid mediaItemId);//Lấy thông tin bài hát theo ID
    Task<MediaItem> GetVideoById(Guid mediaItemId);//Lấy thông tin video theo ID
    Task<List<MediaItem>> GetMediaItemByTitle(string title,int skip, int take);//Lấy list media
    Task<bool>CountView(Guid MediaItemId);//cộng lượt view
    Task<List<MediaItem>> GetViewHigh(int skip, int take);//Lấy 10 thằng view cao nhất

}
