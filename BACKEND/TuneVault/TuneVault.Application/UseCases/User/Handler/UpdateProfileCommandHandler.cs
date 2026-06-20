using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.User.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User.Handler;

public class UpdateProfileCommandHandler: IRequestHandler<UpdateProfileCommand, ProfileUserDto>
{
    private readonly ICurentUserService _currentUserService;
    private readonly IUserProfileRepository _userProfile;
    private readonly IFileStorageService _file;

    public UpdateProfileCommandHandler (IFileStorageService file ,ICurentUserService CurrentUserService, IUserProfileRepository UserProfile)
    {
        _currentUserService=CurrentUserService;
        _userProfile=UserProfile;
        _file=file;
    }

    public async Task<ProfileUserDto> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
    {;
        var user = await _userProfile.GetUserProfileById(_currentUserService.UserId);
        //Kiem tra Id của user
        if(user==null)
        {
            throw new Exception("Người dùng không tồn tại");
        }
        var urlAvatar = await _file.UploadFileAsync(request.FileStream, request.FileName, "image_files", request.ContentType);
        //Cập nhật thông tin người dùng 
        user.Name=request.Name;
        user.AvatarUrl=urlAvatar;
        user.Bio=request.Bio;
        //Lưu lại DataBase
        await _userProfile.UpdateUserProfile(user);
        //Đóng gói trả về cho react
        return new ProfileUserDto
        {
            Id=_currentUserService.UserId,
            Name=user.Name,
            AvatarUrl=user.AvatarUrl,
            Bio=user.Bio

        };


        
    }

}
