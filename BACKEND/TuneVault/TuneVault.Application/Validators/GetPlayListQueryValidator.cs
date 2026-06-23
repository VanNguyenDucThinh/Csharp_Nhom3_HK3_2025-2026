using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class GetPlayListValidator:AbstractValidator<GetPlayListQuery>
{
    public GetPlayListValidator()
    {
        RuleFor(x=>x.IdPlayList).NotEmpty().WithMessage("Không được để Id trống");
    }

}