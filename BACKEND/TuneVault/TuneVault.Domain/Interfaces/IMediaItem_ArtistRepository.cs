using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IMediaItem_ArtistRepository
{
    Task<bool> CreateMediaItemArtist(Guid mediaItemId, Guid artistId);//Tạo mới liên kết giữa bài hát và nghệ sĩ
    Task<bool> DeleteMediaItemArtist(Guid mediaItemId, Guid artistId);//Xóa liên kết giữa bài hát và nghệ sĩ
    Task<IEnumerable<MediaItem>> GetMediaItemsByArtistId(Guid artistId);//Lấy danh sách bài hát của một nghệ sĩ theo ID nghệ sĩ


}
