using System;
using FluentValidation;
using TuneVault.Application.UseCases.Favorite.Command;

namespace TuneVault.Application.Validators;

public class GetFavoriteCommandValidator:AbstractValidator<GetFavoriteCommand>
{
    public GetFavoriteCommandValidator()
    {
    }

}