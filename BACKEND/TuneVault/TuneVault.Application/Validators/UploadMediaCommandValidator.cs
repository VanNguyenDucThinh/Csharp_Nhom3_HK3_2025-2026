using System;
using FluentValidation;
using TuneVault.Application.UseCases.Command;

namespace TuneVault.Application.Validators;

public class UploadMediaCommandValidator:AbstractValidator<UploadMediaCommand>
{
    public UploadMediaCommandValidator()
    {
        RuleFor(x=>x.Title).NotEmpty().WithMessage("Tên không được để trống");
        RuleFor(x=>x.FileStream).NotEmpty().WithMessage("File không được để trống");
    }

}
