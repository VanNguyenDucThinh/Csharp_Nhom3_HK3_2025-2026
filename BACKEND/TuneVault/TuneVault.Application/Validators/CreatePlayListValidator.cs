using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class CreatePlayListValidator:AbstractValidator<CreatePlayListCommand>
{
    public CreatePlayListValidator()
    {
        RuleFor(x=>x.Name).MaximumLength(100).WithMessage("Tên Playlist không được vượt quá 100 ký tự.");
        RuleFor(x=>x.Owner).NotEmpty().WithMessage("Không được để trống");
        When(x => x.ImageFileStream != null, () => 
        {
            RuleFor(x => x.ImageFileName)
                .NotEmpty().WithMessage("Tên file ảnh không hợp lệ.");

            RuleFor(x => x.ImageContentType)
                .NotEmpty().WithMessage("Loại file ảnh không được xác định.");
        });
        

    }

}