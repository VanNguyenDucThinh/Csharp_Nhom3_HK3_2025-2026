using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.User.Command;

public class GetProfileQuery:IRequest<ProfileUserDto>
{
    public Guid IdProfile{get; set;}

    public GetProfileQuery(Guid idProfile)
    {
        IdProfile=idProfile;
    }

}
