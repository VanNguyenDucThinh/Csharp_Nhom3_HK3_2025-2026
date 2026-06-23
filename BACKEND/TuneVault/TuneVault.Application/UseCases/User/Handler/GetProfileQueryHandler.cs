using System;
using MediatR;
using TuneVault.Application.UseCases.User.Command;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Application.CreateException;

namespace TuneVault.Application.UseCases.User.Handler;

public class GetProfileQueryHandler:IRequestHandler<GetProfileQuery,ProfileUserDto>
{
    private readonly IUserProfileRepository _userProfile;

    public GetProfileQueryHandler(IUserProfileRepository userProfile)
    {
        _userProfile=userProfile;
    }

    public async Task<ProfileUserDto> Handle (GetProfileQuery request, CancellationToken cancellationToken)
    {
        var profile = await _userProfile.GetUserProfileById(request.IdProfile);
        if (profile == null)
        {
            throw new NotFoundException($"Không tìm thấy người dùng với ID: {request.IdProfile}");
        }
        return new ProfileUserDto
        {
            Id=profile.Id,
            Name=profile.Name,
            AvatarUrl=profile.AvatarUrl,
            Bio=profile.Bio
        };
    }

}
