using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Favorite.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;

namespace TuneVault.Application.UseCases.Favorite.Handler;

public class GetFavoriteCommandHandler:IRequestHandler<GetFavoriteCommand,List<MediaDto>>
{
    private readonly IFavoriteRepository _favorite;
    private readonly ICurentUserService _curUser;
    private readonly IMediaItemRepository _media;

    public GetFavoriteCommandHandler(IFavoriteRepository favorite, ICurentUserService curUser, IMediaItemRepository media)
    {
        _favorite=favorite;
        _curUser=curUser;
        _media=media;
    }
    public async Task<List<MediaDto>> Handle(GetFavoriteCommand request, CancellationToken cancellationToken)
    {
        var list = await _favorite.GetFavoriteTracks(_curUser.UserId);
        var result = list.Select(x=>new MediaDto
        {
            Id=x.Id,
            Title=x.Title,
            Artist=x.Artist,
            UrlImage=x.UrlImageMedia,
            Category=x.Category,
            Owner=x.Owner
        }).ToList();

        return result;
    }

}
