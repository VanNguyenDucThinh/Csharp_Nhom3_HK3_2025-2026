using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class GetTrackPlayListValidator:AbstractValidator<GetTrackPlayListQuery>
{
    public GetTrackPlayListValidator()
    {
        RuleFor(x=>x.IdPlayList).NotEmpty().WithMessage("Không được để Id trống");
    }

}