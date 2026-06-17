using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Infrastructure.Services.JWT
{
    public class JWTSetting
    {
        public string Secret { get; set; } = null!;  // khóa
        public string Issuer { get; set; } = null!; // Nhà phát hành token (thường là tên hoặc URL của server)
        public string Audience { get; set; } = null!; //Đối tượng dùng token
        public int Expiry { get; set; } // Thời gian tồn tại key
    }
}
