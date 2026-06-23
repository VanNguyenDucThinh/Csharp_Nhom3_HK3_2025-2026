using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class CreatePlayListCommandValidator:AbstractValidator<CreatePlayListCommand>
{
    public CreatePlayListCommandValidator()
    {
        RuleFor(x=>x.Name)
        .NotEmpty().WithMessage("Tên danh sách không được để trống");
    }

}