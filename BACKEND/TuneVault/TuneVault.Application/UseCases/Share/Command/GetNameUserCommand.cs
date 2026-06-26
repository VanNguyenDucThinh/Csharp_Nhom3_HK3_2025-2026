using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Share.Command;

public class GetNameUserShareCommand:IRequest<List<NameUserShareDto>>
{
    public string Name{get ;set;}

    public GetNameUserShareCommand(string name)
    {
        Name=name;
    }

}
