using System;
using MediatR;
using TuneVault.Application.UseCases.Favorite.Command;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Favorite.Handler;

public class ToggleFavoriteCommandHandler:IRequestHandler<ToggleFavoriteCommand, FavoriteDto>
{
    private readonly IFavoriteRepository _favorite;
    private readonly ICurentUserService _curUser;

    public ToggleFavoriteCommandHandler(IFavoriteRepository favorite, ICurentUserService curUser)
    {
        _favorite=favorite;
        _curUser=curUser;
    }

    public async Task<FavoriteDto> Handle (ToggleFavoriteCommand request, CancellationToken cancellationToken)
    {
        var isFavorite = await _favorite.IsFavoriteMedia(_curUser.UserId, request.IdMediaItem);
        if (isFavorite)
        {            
            await _favorite.RemoveFromFavorites(_curUser.UserId,request.IdMediaItem);
            return new FavoriteDto{IsFavorite=false};

        }
        else
        {
            await _favorite.AddToFavorites(_curUser.UserId, request.IdMediaItem);
            return new FavoriteDto{IsFavorite=true};
        }
    }


}
