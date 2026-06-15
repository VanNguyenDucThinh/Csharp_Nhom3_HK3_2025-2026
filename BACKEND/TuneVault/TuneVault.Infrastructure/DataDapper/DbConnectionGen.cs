using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.DataDapper
{
    public class DbConnectionGen : IDbConnectionGen
    {
        private readonly string _connectionString;
        public DbConnectionGen(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new ArgumentNullException(nameof(config), "Connectionstring 'DefaultConnection' not found");
        }

        public IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }
    }
}
