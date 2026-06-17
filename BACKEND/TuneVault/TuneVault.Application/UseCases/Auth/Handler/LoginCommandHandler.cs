using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Auth.Command;
using TuneVault.Domain.Events;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.Auth.Handler;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IUserProfileRepository _userProfile;
    private readonly ITokenGenerator _token;

    public LoginCommandHandler(IUserProfileRepository userProfile, ITokenGenerator token)
    {
        _userProfile = userProfile;
        _token=token;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var userProfile = await _userProfile.IsEmailTakenAsync(request.Email);
        var userProfilePassword = await _userProfile.GetUserProfileByEmail(request.Email);
        //Kiểm tra email tồn tại chưa
        if(!userProfile)
        {
            throw new Exception("Email hoặc mật khẩu không đúng");
        }
        //Kiểm tra mật khẩu
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, userProfilePassword.Password);
        if (!isPasswordValid)
        {
            throw new Exception("Email hoặc mật khẩu không đúng");
        }
        var token = _token.GenerateJwt(userProfilePassword.Id, userProfilePassword.Name, userProfilePassword.Email);
        //Đăng nhập thành công, trả về thông tin người dùng và token (JWT)
        return new AuthResponseDto
        {
            Id = userProfilePassword.Id,
            Name = userProfilePassword.Name,
            Email = userProfilePassword.Email,
            Token = token
        };
    }
}
