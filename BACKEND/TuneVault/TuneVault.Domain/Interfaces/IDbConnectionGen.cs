using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace TuneVault.Domain.Interfaces
{
    public interface IDbConnectionGen
    {
        IDbConnection CreateConnection();
    }
}
