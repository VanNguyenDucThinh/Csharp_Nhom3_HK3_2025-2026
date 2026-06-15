using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IUserProfileRepository
{
    Task<bool> CreateUserProfile(UserProfile userProfile);//Tạo mới người dùng
    Task<bool> UpdateUserProfile(UserProfile userProfile);//Cập nhật thông tin người dùng
    Task<bool> DeleteUserProfile(Guid userId);//Xóa thông tin người dùng
    Task<UserProfile> GetUserProfileById(Guid userId);//Lấy thông tin người dùng theo ID
    Task<UserProfile> GetUserProfileByEmail(string email);//Lấy thông tin người dùng theo email



}