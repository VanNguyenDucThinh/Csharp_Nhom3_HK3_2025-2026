using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using TuneVault.Domain.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

namespace TuneVault.Infrastructure.Services.JWT
{
    public class TokenGenerator : ITokenGenerator
    {
        private readonly JWTSetting _jwtsett;
        public TokenGenerator(IOptions<JWTSetting> options)
        {
            _jwtsett = options.Value;
        }

        public string GenerateJwt(Guid userId, string UserName, string email)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.UniqueName, UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // Id của Token
            }; 
            //lấy key từ cấu hình rồi chuyển string thành byte
            //tạo securitykey
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtsett.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); //dùng thuật toán HmacSha256 để ký key

            var token = new JwtSecurityToken( 
                issuer: _jwtsett.Issuer, //nhà phát hành
                audience: _jwtsett.Audience, //người dùng
                claims:claims, //gắn các thông tin vào token
                expires: DateTime.UtcNow.AddMinutes(_jwtsett.Expiry), //thời gian tồn tại của token
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token); //chuyển thành chuỗi JWT
        }

        public string GenerateRefreshToken()
        {
            var randomNumb = new Byte[32];
            //làm đầy mảng bằng bộ sinh số ngẫu nhiên của hệ thống
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumb);

            // Chuyển mảng byte đó thành một chuỗi mã hóa Base64
            return Convert.ToBase64String(randomNumb);

        }
    }
}
