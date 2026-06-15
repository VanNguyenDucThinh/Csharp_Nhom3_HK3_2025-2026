using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Interfaces
{
    public interface ITokenGenerator
    {
        string GenerateJwt(Guid userId, string UserName, string email);
        string GenerateRefreshToken();
    }
}
