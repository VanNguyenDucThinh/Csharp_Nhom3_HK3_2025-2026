using System;

namespace Domain.Entity;

public class Follow
{
    public Guid IdFollow { get; set; }//khoa chính
    public Guid IdFollower { get; set; }//khoa ngoại, người theo dõi
    public Guid IdFollowing { get; set; }//khoa ngoại, người được theo dõi
    public DateTime FollowAt { get; set; }=DateTime.UtcNow;//Ngay theo doi

}
