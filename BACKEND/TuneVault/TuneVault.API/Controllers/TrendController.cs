using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.SearchAndTrending.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrendController : BaseApiController
    {
        private readonly ICurentUserService _curUser;

        public TrendController(ICurentUserService curUser)
        {
            _curUser = curUser;
        }
        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<SearchTrendingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Trend( 
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10)
        {
            var query = new GetTrendingCommand
            {
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await Mediator.Send(query);

            return Ok(ApiResponse<SearchTrendingDto>.Ok(result));
        }

    }
}
