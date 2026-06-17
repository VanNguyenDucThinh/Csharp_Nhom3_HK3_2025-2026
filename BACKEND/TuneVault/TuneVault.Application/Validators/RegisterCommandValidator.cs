using System;
using FluentValidation;
using TuneVault.Application.UseCases.Auth.Command;

namespace TuneVault.Application.Validators;

public class RegisterCommandValidator:AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x=>x.Email)
        .NotEmpty().WithMessage("Email không được để trống")
        .EmailAddress().WithMessage("Email đúng định dạng");
        
        RuleFor(x=>x.Name)
        .NotEmpty().WithMessage("Không được để trống")
        .MaximumLength(30).WithMessage("Tên không quá 30 kí tự");

        RuleFor(x=>x.Password)
        .MinimumLength(8).WithMessage("Tối thiểu 8 ký tự")
        .Matches(@"[0-9]").WithMessage("Mật khẩu chứa tối thiểu một kí tự số")
        .Matches(@"[a-z]").WithMessage("Mật khẩu chứa tối thiểu một kí tự thường")
        .Matches(@"[A-Z]").WithMessage("Mật khẩu chứa tối thiểu kí tự hoa");

        RuleFor(x=>x.DateOfBirth).NotEmpty().WithMessage("Ngày sinh không được để trống");


    }

}
