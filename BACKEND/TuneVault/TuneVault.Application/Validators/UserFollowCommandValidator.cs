using System;
using FluentValidation;
using TuneVault.Application.UseCases.Follow.Command;

namespace TuneVault.Application.Validators;

public class UserFollowCommandValidator:AbstractValidator<UserFollowCommand>
{
    public UserFollowCommandValidator()
    {
        RuleFor(x=>x.IdUser).NotEmpty().WithMessage("Không được để Id trống");
    }

}