using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IAlbumRepository
{
    Task<bool> CreateAlbum(Album album);//Tạo mới album
    Task<bool> UpdateAlbum(Album album);//Cập nhật thông tin album
    Task<bool> DeleteAlbum(Guid albumId);//Xóa album theo ID

}
