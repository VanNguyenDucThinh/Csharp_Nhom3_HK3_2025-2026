using System;
using FluentValidation;
using TuneVault.Application.UseCases.Command;

namespace TuneVault.Application.Validators;

public class LoginCommandValidators:AbstractValidator<LoginCommand>
{
    public LoginCommandValidators()
    {
        RuleFor(x=>x.Email)
        .NotEmpty().WithMessage("Emali không được để trống")
        .EmailAddress().WithMessage("Không đúng emali tiêu chuẩn");

        RuleFor(x=>x.Password)
        .NotEmpty().WithMessage("Mật khẩu không được để trống");
    }

}
