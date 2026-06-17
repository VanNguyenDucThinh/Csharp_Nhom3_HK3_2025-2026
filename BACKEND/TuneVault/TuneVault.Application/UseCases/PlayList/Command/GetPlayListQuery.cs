using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.PlayList.Command;

public class GetPlayListQuery:IRequest<PlayListDto>
{
    public Guid IdPlayList{get; set;}

    public GetPlayListQuery(Guid idPlayList)
    {
        IdPlayList=idPlayList;
    }

}
