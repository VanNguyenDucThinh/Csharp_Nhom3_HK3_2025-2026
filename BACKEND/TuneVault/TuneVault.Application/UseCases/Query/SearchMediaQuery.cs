using System;
using MediatR;
using TuneVault.Application.DTOs;
namespace TuneVault.Application.UseCases.Query;

public class SearchMediaQuery:IRequest<List<MediaDto>>
{
    public string Title{get; set;}
    public SearchMediaQuery(string title)
    {
        Title=title;
        
    }

}
