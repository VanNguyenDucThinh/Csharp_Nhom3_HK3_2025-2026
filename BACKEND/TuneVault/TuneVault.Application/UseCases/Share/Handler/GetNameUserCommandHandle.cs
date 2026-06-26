using System;
using MediatR;
using TuneVault.Application.UseCases.Share.Command;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Share.Handler;

public class GetNameUserShareCommandHandle:IRequestHandler<GetNameUserShareCommand, List<NameUserShareDto>>
{
    private readonly IUserProfileRepository _user;

    public GetNameUserShareCommandHandle(IUserProfileRepository user)
    {
        _user=user;
    }

    public async Task<List<NameUserShareDto>> Handle(GetNameUserShareCommand request, CancellationToken cancellationToken)
    {
        var listUser = await _user.GetUserProfileByName(request.Name);
        var result = listUser.Select(x=> new NameUserShareDto
        {
            Id=x.Id,
            Name=x.Name,
            Email=x.Email,
            UrlImage=x.AvatarUrl
        }).ToList();
        return result;
        
    }
}
