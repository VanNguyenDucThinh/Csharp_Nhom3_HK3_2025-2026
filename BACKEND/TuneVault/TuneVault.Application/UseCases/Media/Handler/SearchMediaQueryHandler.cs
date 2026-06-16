using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Media.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Command.Handler;

public class SearchMediaQueryHandle:IRequestHandler<SearchMediaQuery,List<MediaDto>>
{
    private readonly IMediaItemRepository _mediaItem;

    public SearchMediaQueryHandle(IMediaItemRepository MediaItem)
    {
        _mediaItem=MediaItem;
    }

    public async Task<List<MediaDto>> Handle (SearchMediaQuery request, CancellationToken cancellationToken)
    {
        var listMediaItem = await _mediaItem.GetMediaItemByTitle(request.Title);

        var resultList = listMediaItem.Select(item=>new MediaDto
        {
            Id=item.Id,
            Title=item.Title,
            UrlMedia=item.UrlMediaItem,
            Owner=item.Owner,
            Category=item.Category
        }).ToList();

        return resultList;
    }
}
