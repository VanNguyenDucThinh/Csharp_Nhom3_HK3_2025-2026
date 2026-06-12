using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces
{
    public interface ITokenRepository
    {
        Task<bool> SaveRefreshTokenAsync(RefreshToken token); //Lưu Refresh Token mới vào DB khi User đăng nhập thành công
        Task<RefreshToken> GetByTokenAsync(string token); //Tìm kiếm Token 
        Task<bool> UpdateTokenAsync(RefreshToken token); //Cập nhật lại trạng thái
    }
}
