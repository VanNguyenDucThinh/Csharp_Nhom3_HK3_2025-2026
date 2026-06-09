using Dapper;
using System;
using System.Collections.Generic;
using System.Text;
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

        //Create
        public async Task<bool> CreateUserProfile(UserProfile userProfile) //register
        {
            ;
            string sql = @"Insert into UserProfile(UserName, [Password], [Email] , [Name])
                           output INSERTED.[UserId]
                           values (@UserName , @Password , @Email , @Name)";
            using var connection = _connection.CreateConnection();
            var command =new CommandDefinition(sql, new
            {
                UserName = userProfile.UserName,
                Password = userProfile.Password,
                Email = userProfile.Email,
                Name = userProfile.Name
            });
            return await connection.QuerySingleAsync(command);
        }

        //Delete
        public async Task<bool> DeleteUserProfile(Guid userId)
        {
            string sql = @"Delete from UserProfile
                           where UserId = @UserId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql , new {UserId = userId});
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }


        //Update
        public async Task<bool> UpdateUserProfile(UserProfile userProfile)
        {
            string sql = @"update UserProfile
                           set [Name] = @Name
                               AvatarUrl = @AvatarUrl
                               DateOfBirth = @DateOfBirth
                               Bio = @Bio
                               where UserId = @UserId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, userProfile);
            int RowsAffected = await connection.ExecuteAsync(command);
            return RowsAffected > 0;
        }

        //Read
        public async Task<UserProfile?> GetUserProfileByIdAsync(Guid userId)
        {
            string sql = @"Select UserId, [Name] , [Email], AvatarUrl, DateOfBirth, Bio, UserName
                           from UserProfile
                           where UserId=@UserId";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql , new {UserId =userId});
            return await connection.QuerySingleOrDefaultAsync<UserProfile>(command);
        }

        //Kiem tra trung
        public async Task<bool> IsEmailTakenAsync(string email) //Kiem tra da co Email nay chua
        {
            string sql = @"select 1 
                           from UserProfile 
                           where [Email] = @Email";
            var command = new CommandDefinition(sql, new { Email = email });
            using var connection = _connection.CreateConnection();
            int count = await connection.QueryFirstOrDefaultAsync<int>(command);
            return count == 1;
        }

        public async Task<bool> IsUserNameTakenAsync(string userName)// Kiem tra xem da co UserName nay chua
        {
            string sql = @"select 1 
                           from UserProfile 
                           where UserName = @UserName";
            var command = new CommandDefinition(sql, new { UserName = userName });
            using var connection = _connection.CreateConnection();
            int count = await connection.QueryFirstOrDefaultAsync<int>(command);
            return count == 1;
        }

        //login
        public async Task<UserProfile?> GetByUserNameOrEmailAsync(string LoginName)
        {
            string sql = @"select UserId, [Name], [Email], [AvatarUrl], [DateOfBirth], [Bio], [UserName], [Password]
                           from UserProfile
                           where UserName = @LoginName or [Email] = @LoginName";
            using var connection = _connection.CreateConnection();
            var command = new CommandDefinition(sql, new {LoginName = LoginName});
            return await connection.QueryFirstOrDefaultAsync<UserProfile>(command);
        }
    }
}
