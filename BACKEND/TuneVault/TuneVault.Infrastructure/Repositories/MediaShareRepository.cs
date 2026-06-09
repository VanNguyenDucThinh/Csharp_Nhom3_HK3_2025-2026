using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class MediaShareRepository : IMediaShareRepository
    {
        private readonly IDbConnectionGen _connection;
        public MediaShareRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }

        public async Task<bool> CreateMediaShare(MediaShare mediaShare)
        {
            string sql = @"Insert into MediaShare(IdSender , IdReceiver , IdMediaItem, IdPlayList, ShareAt)
                           values (@IdSender, @IdReceiver, @IdMediaItem, NULL, @ShareAt)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                IdSender = mediaShare.IdSender,
                IdReceiver = mediaShare.IdReceiver,
                IdMediaItem = mediaShare.IdMediaItem,
                ShareAt = mediaShare.ShareAt,
            });
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected> 0;
        }
    }
}
