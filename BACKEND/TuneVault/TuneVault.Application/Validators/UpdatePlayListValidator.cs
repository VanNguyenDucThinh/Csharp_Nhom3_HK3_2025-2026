using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.Validators;

public class UpdatePlayListValidator:AbstractValidator<UpdatePlayListCommand>
{
    public UpdatePlayListValidator(ICurentUserService curUser)
    {
        RuleFor(x=>x.Name)
        .NotEmpty().WithMessage("Không được để trống")
        .MaximumLength(50).WithMessage("Tối đa 50 kí tự");
    }

}
