using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces
{
    public interface INotificationService
    {
        Task SendNotificationToUser(string UserId, Notification notification); //Gửi thông báo tới 1 user (Chia sẻ)
        Task SendNotificationToGroup(string GroupName, Notification notification);//Gửi thông báo tới 1 nhóm (Artist có bài mới)
    }
}
