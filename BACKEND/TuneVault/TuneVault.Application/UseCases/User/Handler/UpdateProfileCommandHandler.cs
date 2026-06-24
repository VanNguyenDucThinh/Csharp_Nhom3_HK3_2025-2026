using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.User.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.User.Handler;

public class UpdateProfileCommandHandler : IRequestHandler<UpdateProfileCommand, ProfileUserDto>
{
    private readonly ICurentUserService _currentUserService;
    private readonly IUserProfileRepository _userProfile;
    private readonly IFileStorageService _file;

    public UpdateProfileCommandHandler(
        IFileStorageService file,
        ICurentUserService currentUserService,
        IUserProfileRepository userProfile)
    {
        _currentUserService = currentUserService;
        _userProfile = userProfile;
        _file = file;
    }

    public async Task<ProfileUserDto> Handle(
        UpdateProfileCommand request,
        CancellationToken cancellationToken)
    {
        var user = await _userProfile.GetUserProfileById(_currentUserService.UserId);

        if (user == null)
            throw new Exception("Người dùng không tồn tại");

        // SỬA: Chỉ upload và cập nhật avatar khi người dùng gửi file mới.
        // Trước đây luôn gọi UploadFileAsync dù FileStream = null
        // → service upload bị lỗi với null stream → throw exception → lỗi 500.
        // Nếu không có file mới, giữ nguyên AvatarUrl hiện tại của user.
        if (request.FileStream != null)
        {
            var urlAvatar = await _file.UploadFileAsync(
                request.FileStream,
                request.FileName,
                "image_files",
                request.ContentType
            );
            user.AvatarUrl = urlAvatar;
        }
        // Nếu FileStream == null: không đụng vào user.AvatarUrl → giữ nguyên ảnh cũ

        // Cập nhật Name và Bio (luôn ghi đè vì frontend luôn gửi 2 field này)
        user.Name = request.Name;
        user.Bio  = request.Bio;

        await _userProfile.UpdateUserProfile(user);

        return new ProfileUserDto
        {
            Id        = _currentUserService.UserId,
            Name      = user.Name,
            AvatarUrl = user.AvatarUrl,
            Bio       = user.Bio
        };
    }
}