using System;
using FluentValidation;
using TuneVault.Application.UseCases.PlayList.Command;

namespace TuneVault.Application.Validators;

public class UpdatePlayListValidator:AbstractValidator<UpdatePlayListCommand>
{
    public UpdatePlayListValidator()
    {
        RuleFor(x=>x.Name).MaximumLength(100).WithMessage("Tên Playlist không được vượt quá 100 ký tự.");
        RuleFor(x=>x.IdPlayList).NotEmpty().WithMessage("Không được để trống");
        When(x => x.FileStream != null, () => 
        {
            RuleFor(x => x.FileName)
                .NotEmpty().WithMessage("Tên file ảnh không hợp lệ.");

            RuleFor(x => x.ContentType)
                .NotEmpty().WithMessage("Loại file ảnh không được xác định.");
        });
        

    }

}