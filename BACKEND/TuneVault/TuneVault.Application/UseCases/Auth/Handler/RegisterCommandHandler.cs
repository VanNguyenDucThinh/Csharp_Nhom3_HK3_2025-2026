using System;
using MediatR;
using FluentValidation;
using TuneVault.Application.UseCases.Auth.Command;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;
using TuneVault.Application.CreateException;

namespace TuneVault.Application.UseCases.Auth.Handler;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    public readonly IUserProfileRepository _userProfile;
    public readonly ITokenGenerator _token;
    public readonly IMediator _mediator;// để gọi đến UserRegisteredEvent sau khi đăng ký thành công

    //DI
    public RegisterCommandHandler(IUserProfileRepository userProfile, IMediator mediator, ITokenGenerator token)
    {
        _userProfile = userProfile;
        _mediator = mediator;
        _token=token;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        //Kiem tra email đã tồn tại chưa
        if (await _userProfile.IsEmailTakenAsync(request.Email))
        {
            throw new BadRequestException("Email đã tồn tại");
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
        var isSuccess=await _userProfile.CreateUserProfile(userProfile);
        if (!isSuccess)
        {
            throw new Exception("Đăng ký thất bại! Vui lòng thử lại");
        }
        await _mediator.Publish(new UserRegisteredEvent(userProfile.Id, userProfile.Email, userProfile.Name));
        var token =  _token.GenerateJwt(userProfile.Id, request.Name, request.Email);

        return new AuthResponseDto
        {
            Id = userProfile.Id,
            Name = userProfile.Name,
            Email = userProfile.Email,
            Token = token
        };
    }

}