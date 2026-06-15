using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Handler;

public class UpdateProfileCommandHandler: IRequestHandler<UpdateProfileCommand, ProfileUserDto>
{
    private readonly ICurentUserService _currentUserService;
    private readonly IUserProfileRepository _userProfile;

    public UpdateProfileCommandHandler (ICurentUserService CurrentUserService, IUserProfileRepository UserProfile)
    {
        _currentUserService=CurrentUserService;
        _userProfile=UserProfile;
    }

    public async Task<ProfileUserDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {;
        var user = await _userProfile.GetUserProfileById(_currentUserService.UserId);
        //Kiem tra Id của user
        if(user==null)
        {
            throw new Exception("Người dùng không tồn tại");
        }
        //Cập nhật thông tin người dùng 
        user.Name=request.Name;
        user.AvatarUrl=request.AvatarUrl;
        user.Bio=request.Bio;
        //Lưu lại DataBase
        await _userProfile.UpdateUserProfile(user);
        //Đóng gói trả về cho react
        return new ProfileUserDto
        {
            Name=user.Name,
            AvatarUrl=user.AvatarUrl,
            Bio=user.Bio

        };


        
    }

}
