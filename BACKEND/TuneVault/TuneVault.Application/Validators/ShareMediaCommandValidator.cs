using System;
using FluentValidation;
using TuneVault.Application.UseCases.Share.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.Validators;

public class ShareMediaCommandValidator:AbstractValidator<ShareMediaCommand>
{
    public ShareMediaCommandValidator()
    {
        RuleFor(x=>x.IdItem)
        .NotEmpty().WithMessage("Không được để trống");
    }

}
