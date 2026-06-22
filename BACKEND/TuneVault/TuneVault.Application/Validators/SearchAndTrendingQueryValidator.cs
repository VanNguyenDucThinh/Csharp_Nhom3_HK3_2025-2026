using System;
using FluentValidation;
using TuneVault.Application.UseCases.SearchAndTrending.Command;

public class SearchAndTredingQueryValidator : AbstractValidator<SearchAndTrendingQuery>
{
    public SearchAndTredingQueryValidator()
    {
        RuleFor(x=>x.Title).NotEmpty().WithMessage("Không được bỏ trống");
        RuleFor(x => x.PageNumber)
            .GreaterThan(0).WithMessage("PageNumber phải lớn hơn 0.");
        RuleFor(x => x.PageSize)
            .GreaterThan(0).LessThanOrEqualTo(50).WithMessage("PageSize tối đa là 50 để tránh quá tải.");
        RuleFor(x => x.Title)
            .MaximumLength(100).WithMessage("Từ khóa tìm kiếm quá dài.");
    }
}