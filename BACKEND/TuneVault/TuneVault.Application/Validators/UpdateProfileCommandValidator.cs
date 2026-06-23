using System;
using FluentValidation;
using TuneVault.Application.UseCases.User.Command;

namespace TuneVault.Application.Validators;

public class UpdateProfileCommandValidators:AbstractValidator<UpdateProfileCommand>
{
    public UpdateProfileCommandValidators()
    {
        RuleFor(x=>x.Bio).MaximumLength(500).WithMessage("Tiểu sử không được vượt quá 500 ký tự.");
        RuleFor(x=>x.Name)
            .NotEmpty().WithMessage("không được để trống")
            .MaximumLength(500).WithMessage("Tiểu sử không được vượt quá 500 ký tự.");
        When(x => x.FileStream != null, () => 
        {
            RuleFor(x => x.FileName)
                .NotEmpty().WithMessage("Tên file ảnh không hợp lệ.");

            RuleFor(x => x.ContentType)
                .NotEmpty().WithMessage("Loại file ảnh không được xác định.");
        });
    }

}
