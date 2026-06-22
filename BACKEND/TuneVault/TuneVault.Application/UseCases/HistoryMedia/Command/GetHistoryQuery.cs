using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.HistoryMedia.Command;

public class GetHistoryQuery:IRequest<List<HistoryMediaDto>>
{
    public Guid IdUser{get; set;}

    public GetHistoryQuery(Guid idUser)
    {
        IdUser=idUser;
    }

}
