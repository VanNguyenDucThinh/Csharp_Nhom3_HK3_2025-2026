using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Entities
{
    public class RefreshToken
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Token { get; set; } = string.Empty; 
        public DateTime ExpiryDate { get; set; } //thời hạn
        public bool IsUsed { get; set; } // đã được dùng chưa
        public bool IsRevoked { get; set; }  // đã bị hủy chưa
    }
}

