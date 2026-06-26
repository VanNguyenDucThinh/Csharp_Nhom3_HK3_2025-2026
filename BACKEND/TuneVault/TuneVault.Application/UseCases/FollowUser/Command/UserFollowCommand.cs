using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.Follow.Command;

public class UserFollowCommand:IRequest<FollowDto>
{
    public Guid IdUser{get; set;}

    public UserFollowCommand(Guid iduser)
    {
        IdUser=iduser;
    }
}
