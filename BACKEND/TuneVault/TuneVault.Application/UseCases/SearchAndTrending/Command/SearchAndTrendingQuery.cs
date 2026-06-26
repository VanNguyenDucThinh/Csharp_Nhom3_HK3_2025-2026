using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.SearchAndTrending.Command;

public class SearchAndTrendingQuery:IRequest<SearchTrendingDto>
{
    public string? Title{get; set;}

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;

}
