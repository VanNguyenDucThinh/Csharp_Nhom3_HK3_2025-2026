using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IFavoriteRepository
{
    Task<bool> AddToFavorites(Favorite favorite);//Thêm bài hát vào danh sách yêu thích
    Task<bool> RemoveFromFavorites(Guid userId, Guid mediaItemId);//Xóa bài hát khỏi danh sách yêu thích
    Task<IEnumerable<MediaItem>> GetFavoriteTracks(Guid userId);//Lấy danh sách bài hát yêu thích của người dùng theo ID người dùng
}
