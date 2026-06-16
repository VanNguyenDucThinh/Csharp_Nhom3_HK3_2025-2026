using System;
using MediatR;
using FluentValidation;
using TuneVault.Application.UseCases.Auth.Command;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;

namespace TuneVault.Application.UseCases.Auth.Handler;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    public readonly IUserProfileRepository _userProfile;
    public readonly IMediator _mediator;// để gọi đến UserRegisteredEvent sau khi đăng ký thành công

    //DI
    public RegisterCommandHandler(IUserProfileRepository userProfile, IMediator mediator)
    {
        _userProfile = userProfile;
        _mediator = mediator;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        //Kiem tra email đã tồn tại chưa
        if (_userProfile.GetUserProfileByEmail(request.Email) != null)
        {
            throw new Exception("Email đã tồn tại");
        }
        //Tạo mới user profile
        var userProfile = new UserProfile
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password), //Mã hóa mật khẩu
        };
        //Lưu user profile vào database
        await _userProfile.CreateUserProfile(userProfile);
        //Sự kiện đăng ký thành công
        await _mediator.Publish(new UserRegisteredEvent(userProfile.Id, userProfile.Email, userProfile.Name));
        //Trả về thông tin người dùng và token (JWT)
        return new AuthResponseDto
        {
            Id = userProfile.Id,
            Name = userProfile.Name,
            Email = userProfile.Email,
            Token = "JWT_TOKEN" //TODO: Tạo JWT token thực tế
        };
    }

}