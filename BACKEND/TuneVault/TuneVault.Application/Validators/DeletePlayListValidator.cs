using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class DeletePlayListValidator:AbstractValidator<DeletePlayListComman>
{
    public DeletePlayListValidator()
    {
        RuleFor(x=>x.IdPlaylist).NotEmpty().WithMessage("Không được để Id trống");
    }

}