using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class AddTrackToPlayListValidator:AbstractValidator<AddTrackToPlaylistCommand>
{
    public AddTrackToPlayListValidator()
    {
        RuleFor(x=>x.IdPlayList).NotEmpty().WithMessage("Không được để Id trống");
        RuleFor(x=>x.IdTrack).NotEmpty().WithMessage("Không được để Id trống");
    }

}