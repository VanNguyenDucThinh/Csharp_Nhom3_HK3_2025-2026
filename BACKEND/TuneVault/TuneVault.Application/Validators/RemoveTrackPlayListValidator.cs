using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class RemoveTrackPlayListValidator:AbstractValidator<RemoveTrackFromPlaylistCommand>
{
    public RemoveTrackPlayListValidator()
    {
        RuleFor(x=>x.IdPlayList).NotEmpty().WithMessage("Không được để Id trống");
        RuleFor(x=>x.IdTrack).NotEmpty().WithMessage("Không được để Id trống");
    }

}