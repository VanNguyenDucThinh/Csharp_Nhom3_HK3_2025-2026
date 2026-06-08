using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface INotificationRepository
{
    Task<bool> CreateNotification(Notification notification);//Tạo mới thông báo

}
