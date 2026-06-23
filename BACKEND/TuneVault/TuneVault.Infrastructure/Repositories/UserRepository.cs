using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Repositories
{
    public class UserRepository : IUserProfileRepository
    {
        private readonly IDbConnectionGen _connection;
        
        public UserRepository(IDbConnectionGen connection)
        {
            _connection = connection;
        }
        
        // Create
        public async Task<bool> CreateUserProfile(UserProfile userProfile) //register
        {
            string sql = @"Insert into UserProfile([Password], [Email] , [Name])
                           output INSERTED.[Id]
                           values (@Password , @Email , @Name)";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new
            {
                UserName = userProfile.Name,
                Password = userProfile.Password,
                Email = userProfile.Email,
                Name = userProfile.Name
            });
            int rowsAffected = await connection.ExecuteAsync(command);
            return rowsAffected > 0;
        }

        // Delete
        public async Task<bool> DeleteUserProfile(Guid userId)
        {
            string sql = @"Delete from UserProfile
                           where Id = @Id"; // Đổi @UserId thành @Id
            using var connection = _connection.CreateConnection();
            // Đổi tên tham số truyền vào cho khớp với @Id
            var command = new CommandDefinition(sql, new { Id = userId }); 
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        // Update
        public async Task<bool> UpdateUserProfile(UserProfile userProfile)
        {
            string sql = @"update UserProfile
                           set [Name] = @Name,
                               AvatarUrl = @AvatarUrl,
                               Bio = @Bio
                           where Id = @Id"; // Đổi @UserId thành @Id
            using var connection = _connection.CreateConnection();
            // userProfile đã có sẵn thuộc tính Id, Dapper sẽ tự động map vào @Id
            var command = new CommandDefinition(sql, userProfile);
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        // Read
        public async Task<UserProfile?> GetUserProfileById(Guid userId)
        {
            string sql = @"Select Id, [Name] , [Email], AvatarUrl, Bio
                           from UserProfile
                           where Id = @Id"; // Sửa UserId thành Id và @UserId thành @Id
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Id = userId });
            return await connection.QuerySingleOrDefaultAsync<UserProfile>(command);
        }

        public async Task<UserProfile> GetUserProfileByEmail(string email)
        {
            string sql = @"Select Id, [Name] , [Email], AvatarUrl, Bio, Password
                           from UserProfile
                           where [Email]=@Email"; // Sửa UserId thành Id
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { Email = email });
            return await connection.QuerySingleOrDefaultAsync<UserProfile>(command);
        }

        // Kiem tra trung
        public async Task<bool> IsEmailTakenAsync(string email) 
        {
            string sql = @"select 1 
                           from UserProfile 
                           where [Email] = @Email";
            var command = new CommandDefinition(sql, new { Email = email });
            using var connection = _connection.CreateConnection();
            int count = await connection.QueryFirstOrDefaultAsync<int>(command);
            return count == 1;
        }

        public async Task<bool> IsUserNameTakenAsync(string userName)
        {
            string sql = @"select 1 
                           from UserProfile 
                           where UserName = @UserName";
            var command = new CommandDefinition(sql, new { UserName = userName });
            using var connection = _connection.CreateConnection();
            int count = await connection.QueryFirstOrDefaultAsync<int>(command);
            return count == 1;
        }

        // login
        public async Task<UserProfile?> GetByUserNameOrEmailAsync(string LoginName)
        {
            string sql = @"select Id, [Name], [Email], [AvatarUrl], [Bio], [Password]
                           from UserProfile
                           where UserName = @LoginName or [Email] = @LoginName"; // Sửa UserId thành Id
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new { LoginName = LoginName });
            return await connection.QueryFirstOrDefaultAsync<UserProfile>(command);
        }

        public Task<UserProfile> GetArtistById(Guid userId)
        {
            throw new NotImplementedException();
        }
    }
}