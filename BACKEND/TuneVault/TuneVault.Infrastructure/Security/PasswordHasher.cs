using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Security
{
    public class PasswordHasher : IPasswordHash
    {
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.EnhancedHashPassword(password);
        }

        public bool VerifyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.EnhancedVerify(password, passwordHash);
        }
    }
}
