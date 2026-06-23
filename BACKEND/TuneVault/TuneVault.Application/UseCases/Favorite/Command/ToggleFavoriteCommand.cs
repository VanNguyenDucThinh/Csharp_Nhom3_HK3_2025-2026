using System;
using MediatR;
using TuneVault.Application.Security;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Favorite.Command;
[Authorize]
public class ToggleFavoriteCommand:IRequest<FavoriteDto>
{
    public Guid IdMediaItem{get; set;}

    public ToggleFavoriteCommand(Guid idMediaItem)
    {
        IdMediaItem=idMediaItem;
    }
}
