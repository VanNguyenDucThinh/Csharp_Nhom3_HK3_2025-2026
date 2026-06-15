using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Interfaces
{
    public interface IPasswordHash
    {
        string HashPassword(string password);
        bool VerifyPassword(string password, string passwordHash);
    }
}
