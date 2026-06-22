using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Video.Command;

public class GetVideoQuery:IRequest<VideoDto>
{
    public Guid IdVideo{get; set;}

    public GetVideoQuery(Guid idVideo)
    {
        IdVideo=idVideo;
    }

}
