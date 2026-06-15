using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Handler;

public class UserFollowCommandHandler:IRequestHandler<UserFollowCommand, FollowDto>
{
    private readonly IFollowRepository _follow;
    private readonly IMediator _mediator;

}
