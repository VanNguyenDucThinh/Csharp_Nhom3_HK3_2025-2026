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
            string sql = @"insert into Notification(IdUser, [Type], Payload)
                           values(@IdUser, @Type, @Payload)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdUser = notification.IdUser,
                Type = (int)notification.Type,
                Payload = notification.Payload
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }
    }
}
