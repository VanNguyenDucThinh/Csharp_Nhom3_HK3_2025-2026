using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.UseCases.HistoryMedia.Command;
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
        [HttpGet]
        public async Task<IActionResult> GetHistory()
        {
            var command = new GetHistoryQuery(_currentUserService.UserId);
            var result = await Mediator.Send(command);
            if (result == null)
            {
                return NotFound("Không tìm thấy lịch sử nghe nhạc."); 
            }

            return Ok(result);
        }
        


    }
}
