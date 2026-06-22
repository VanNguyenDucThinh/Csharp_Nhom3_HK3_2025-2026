using System;
using FluentValidation;
using TuneVault.Application.UseCases.NotificationUser.Command;

namespace TuneVault.Application.Validators;

public class MaskAsReadValidator:AbstractValidator< MaskAsReadQuery>
{
    public MaskAsReadValidator()
    {
        RuleFor(x=>x.IdNotification).NotEmpty().WithMessage("Không được để id trống");
    }

}