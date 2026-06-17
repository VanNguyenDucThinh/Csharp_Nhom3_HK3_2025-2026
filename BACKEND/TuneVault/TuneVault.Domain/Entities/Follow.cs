using System;

namespace TuneVault.Domain.Entities;

public class FollowEntities
{
    public Guid IdFollower { get; set; }//khoa ngoại, người theo dõi
    public Guid IdFollowing { get; set; }//khoa ngoại, người được theo dõi
    public DateTime FollowAt { get; set; }=DateTime.UtcNow;//Ngay theo doi

}
