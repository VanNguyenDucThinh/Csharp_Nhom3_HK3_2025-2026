using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.Security
{
    public class CurrenUserService : ICurentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrenUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid UserId => Guid.Parse(_httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
    }
}
