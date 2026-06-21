using Dapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly IDbConnectionGen _connection;
        public NotificationRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> CreateNotification(Notification notification)
        {
            string sql = @"insert into Notification(IdUser, [Type], Payload, IsRead)
                           values(@IdUser, @Type, @Payload, @IsRead)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdUser = notification.IdUser,
                Type = (int)notification.Type,
                Payload = notification.Payload,
                IsRead =(int) notification.IsRead
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
        public async Task<List<Notification>> GetNotifications(Guid idUser)
        {
            string sql=@"SELECT * FROM Notification WHERE IdUser = @IdUser";
            using var connection = _connection.CreateConnection();
            var notifications = await connection.QueryAsync<Notification>(sql, new { IdUser = idUser });
            
            return notifications.ToList();

        }

        public async Task<List<Notification>> GetNotificationsNotRead(Guid idUser)
        {
            string sql = "SELECT * FROM Notification WHERE IdUser = @IdUser AND IsRead = 0";
            
            using var connection = _connection.CreateConnection();
            var notifications = await connection.QueryAsync<Notification>(sql, new { IdUser = idUser });
            
            return notifications.ToList();
        }

        public async Task<List<Notification>> GetNotificationsRead(Guid idUser)
        {
            // Assuming IsRead = 1 means it has been read
            string sql = "SELECT * FROM Notification WHERE IdUser = @IdUser AND IsRead = 1";
            
            using var connection = _connection.CreateConnection();
            var notifications = await connection.QueryAsync<Notification>(sql, new { IdUser = idUser });
            
            return notifications.ToList();
        }

        public async Task<bool> UpdateNotification(Guid idUser,Guid idNotification, int isRead)
        {
            // Updates the read status for all notifications belonging to a specific user
            string sql = "UPDATE Notification SET IsRead = @IsRead WHERE IdUser = @IdUser AND Id=@Id";
            
            using var connection = _connection.CreateConnection();
            int rowsAffected = await connection.ExecuteAsync(sql, new 
            { 
                IdUser = idUser, 
                IsRead = isRead,
                Id=idNotification 
            });
            
            return rowsAffected > 0;
        }
    }
}
