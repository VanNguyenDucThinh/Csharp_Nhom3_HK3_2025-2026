using System;

namespace TuneVault.Domain.Interfaces;

public interface IFollowRepository
{
    Task<bool> FollowUser(Guid followerId, Guid followeeId);//Theo dõi người dùng khác
    Task<bool> UnfollowUser(Guid followerId, Guid followeeId);//Bỏ theo dõi người dùng khác
    Task<IEnumerable<Guid>> GetFollowing(Guid userId);//Lấy ID những người đang theo dõi


}
