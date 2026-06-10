using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Events;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Handler;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IUserProfileRepository _userProfile;

    public LoginCommandHandler(IUserProfileRepository userProfile)
    {
        _userProfile = userProfile;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var userProfile = await _userProfile.GetUserProfileByEmail(request.Email);
        //Kiểm tra email tồn tại chưa
        if(userProfile == null)
        {
            throw new Exception("Email hoặc mật khẩu không đúng");
        }
        //Kiểm tra mật khẩu
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, userProfile.Password);
        if (!isPasswordValid)
        {
            throw new Exception("Email hoặc mật khẩu không đúng");
        }
        //Đăng nhập thành công, trả về thông tin người dùng và token (JWT)
        return new AuthResponseDto
        {
            Id = userProfile.Id,
            Name = userProfile.Name,
            Email = userProfile.Email,
            Token = "JWT_TOKEN" //TODO: Tạo JWT token thực tế
        };
    }
}
