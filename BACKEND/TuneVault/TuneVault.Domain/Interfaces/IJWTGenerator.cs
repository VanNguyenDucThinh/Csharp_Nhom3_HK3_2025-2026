using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Interfaces
{
    public interface IJWTGenerator
    {
        string GenerateJwt(Guid userId, string UserName, string email);
    }
}
