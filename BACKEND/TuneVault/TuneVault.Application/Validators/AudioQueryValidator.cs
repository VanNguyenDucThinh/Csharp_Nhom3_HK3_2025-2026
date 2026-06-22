using System;
using FluentValidation;
using TuneVault.Application.UseCases.Audio.Command;

namespace TuneVault.Application.Validators;

public class AudioQueryValidator:AbstractValidator<AudioQuery>
{
    public AudioQueryValidator()
    {
        RuleFor(x=>x.Id).NotEmpty().WithMessage("Không được để Id trống");
    }

}