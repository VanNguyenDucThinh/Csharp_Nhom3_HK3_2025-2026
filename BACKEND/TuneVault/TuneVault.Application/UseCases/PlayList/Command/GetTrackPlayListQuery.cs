using System;
using TuneVault.Application.DTOs;
using MediatR;

namespace TuneVault.Application.UseCases.PlayList.Command;

public class GetTrackPlayListQuery:IRequest<PlayListDto>
{

    public Guid IdPlayList{get; set;}
    public GetTrackPlayListQuery(Guid idPlayList)
    {
        IdPlayList=idPlayList;
    }

}
