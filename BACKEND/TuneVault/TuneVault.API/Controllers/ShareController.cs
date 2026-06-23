using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneVault.API.Common;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases;
using TuneVault.Application.UseCases.Share.Command;
using TuneVault.Domain.Enums;

namespace TuneVault.API.Controllers;
public class ShareController : BaseApiController
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ShareMediaDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ShareMedia([FromBody] ShareMediaRequest request)
    {
        var command = new ShareMediaCommand(
            request.ReceiverUserId,
            request.ItemId,
            request.ShareStyle);

        var result = await Mediator.Send(command);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse.Fail(result.Notification));

        return StatusCode(StatusCodes.Status201Created,
            ApiResponse<ShareMediaDto>.Ok(result, result.Notification));
    }
    [HttpGet("received")]
    [ProducesResponseType(typeof(ApiResponse<List<SharedItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetReceived()
    {
        var query = new GetSharedQuery();
        var result = await Mediator.Send(query);
        return Ok(ApiResponse<List<SharedItemDto>>.Ok(result));
    }
}

// ── Request DTOs ──────────────────────────────────────────────────────────
public record ShareMediaRequest{
    [System.ComponentModel.DataAnnotations.Required]
    public Guid ReceiverUserId{get; set;}
    [System.ComponentModel.DataAnnotations.Required]
    public Guid ItemId{get; set;}
    [System.ComponentModel.DataAnnotations.Required]
    public ShareStyle ShareStyle{get; set;}
};