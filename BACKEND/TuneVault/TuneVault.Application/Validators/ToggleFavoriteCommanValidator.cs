using System;
using FluentValidation;
using TuneVault.Application.UseCases.Favorite.Command;

namespace TuneVault.Application.Validators;

public class ToggleFavoriteCommanValidator:AbstractValidator<ToggleFavoriteCommand>
{
    public ToggleFavoriteCommanValidator()
    {
        RuleFor(x=>x.IdMediaItem).NotEmpty().WithMessage("Không được để Id trống");
    }

}