using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Follow.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;

namespace TuneVault.Application.UseCases.FollowUser.Handler;

public class UserFollowCommandHandler:IRequestHandler<UserFollowCommand, FollowDto>
{
    private readonly IFollowRepository _follow;
    private readonly ICurentUserService _curUser;
    private readonly IMediator _mediator;

    public UserFollowCommandHandler(IFollowRepository follow, IMediator mediator, ICurentUserService curUser)
    {
        _follow=follow;
        _mediator=mediator;
        _curUser=curUser;
    }

    public async Task<FollowDto> Handle(UserFollowCommand request, CancellationToken cancellationToken)
    {
        if(_curUser.UserId==request.IdUser)
        {
            return new FollowDto
            {
                IsSuccess=false,
                Message="Không thể follow chính mình",
                IsFollow=false
            };
        }
        //Kiểm tra đã follow 
        bool isFollow = await _follow.FollowUser(_curUser.UserId,request.IdUser);
        //Bấm hủy follow khi đã follow
        if (isFollow)
        {
            await _follow.UnfollowUser(_curUser.UserId,request.IdUser);
            return new FollowDto
            {
                IsSuccess=true,
                Message="Hủy follow thành công",
                IsFollow=false
            };
        }
        else
        {
            var addFollow = new FollowEntities
            {
                IdFollower=_curUser.UserId,
                IdFollowing=request.IdUser,
                FollowAt=DateTime.UtcNow
                
            };        
            await _follow.AddFollow(addFollow);

            var followEvent = new UserFollowedEvent(_curUser.UserId,request.IdUser);
            await _mediator.Publish(followEvent,cancellationToken);

            return new FollowDto
            {
                IsSuccess=true,
                Message="Follow thành công",
                IsFollow=true
            };
        }

    }

}
