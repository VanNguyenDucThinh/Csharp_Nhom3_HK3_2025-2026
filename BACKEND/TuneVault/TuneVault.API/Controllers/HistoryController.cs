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

        public HistoryController(ICurentUserService currentUserService){_currentUserService = currentUserService;}

        [HttpGet]
        [Authorize]

        public async Task<IActionResult> GetHistory()
        {
            var command = new GetHistoryQuery();
            var result = await Mediator.Send(command);
            return Ok(new ApiResponse<HistoryMediaDto[]>(result.ToArray()));
        }
    }
}
