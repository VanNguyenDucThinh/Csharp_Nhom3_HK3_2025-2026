using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface INotificationRepository
{
    Task<bool> CreateNotification(Notification notification);//Tạo mới thông báo
    Task<List<Notification>> GetNotifications(Guid idUser);
    Task<List<Notification>> GetNotificationsNotRead(Guid idUser);
    Task<List<Notification>> GetNotificationsRead(Guid idUser);
    Task<bool> UpdateNotification (Guid idUser, Guid idNotification, int isRead);

}
