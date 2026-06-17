using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Audio.Command;

public class AudioQuery:IRequest<AudioMediaDto>
{
    public Guid Id {get; set;}

    public AudioQuery(Guid id)
    {
        Id=id;
    }


}
