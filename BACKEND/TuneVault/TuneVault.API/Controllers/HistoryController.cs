using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.UseCases.NotificationUser.Command;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryController : BaseApiController
    {
        private readonly ICurentUserService _currentUserService;

    // Inject ICurrentUserService vào Controller
        public HistoryController(ICurentUserService currentUserService)
        {
            _currentUserService = currentUserService;
        }
        


    }
}
