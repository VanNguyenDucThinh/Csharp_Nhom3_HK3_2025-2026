using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IArtistRepository
{
    Task<bool> CreateArtist(Artist artist);//Tạo mới nghệ sĩ
    Task<Artist> GetArtistById(Guid id);//Lấy thông tin nghệ sĩ theo ID
    Task<bool> UpdateArtist(Artist artist);//Cập nhật thông tin nghệ sĩ
    Task<bool> DeleteArtist(Guid id);//Xóa nghệ sĩ theo ID


}
