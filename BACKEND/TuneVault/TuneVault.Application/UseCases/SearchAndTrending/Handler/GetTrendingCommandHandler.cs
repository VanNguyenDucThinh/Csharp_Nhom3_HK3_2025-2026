using System;
using MediatR;
using System.Linq;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.SearchAndTrending.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.SearchAndTrending.Handler;

public class GetTrendingCommandHandler:IRequestHandler<GetTrendingCommand, SearchTrendingDto>
{
    private IMediaItemRepository _trend;

    public GetTrendingCommandHandler(IMediaItemRepository trend)
    {
        _trend=trend;
    }
    public async Task<SearchTrendingDto> Handle(GetTrendingCommand request, CancellationToken cancellationToken)
    {


        int skip = (request.PageNumber - 1) * request.PageSize;
        int take = request.PageSize;
        var list = await _trend.GetViewHigh(skip, take);
        var page = new SearchTrendingDto
        {
            CurrentPage=request.PageNumber,
            ListTrending=list.Select(x=> new MediaDto
            {
                Id=x.Id,
                Artist=x.Artist,
                Category=x.Category,
                Owner=x.Owner,
                Title=x.Title,
                UrlImage=x.UrlImageMedia
            }).ToList()
            
        };
        return page;
    }

}
