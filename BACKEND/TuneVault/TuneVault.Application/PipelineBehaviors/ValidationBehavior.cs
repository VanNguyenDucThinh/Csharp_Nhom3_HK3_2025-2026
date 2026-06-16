using System;
using MediatR;
using FluentValidation;

namespace TuneVault.Application.PipelineBehaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validator;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> Validator)
    {
        _validator = Validator;
    }
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!_validator.Any())
        {
            return await next();
        }
        //Lấy những yêu cầu cần kiểm tra 
        var context = new ValidationContext<TRequest>(request);
        //kiểm tra 1 lượt rồi in ra danh sách báo cáo
        var validatorresult = await Task.WhenAll(_validator.Select(x=>x.ValidateAsync(context, cancellationToken)));
        //Lấy danh sách báo cáo kiểm tra có lỗi không
        var failures = validatorresult
        .Where(x=>x.Errors.Any())//có bất kì lỗi nào không có thì true không thì false
        .SelectMany(x=>x.Errors)//Lấy các lỗi ra từ các danh sách
        .ToList();// gom lại thành một list

        if (failures.Any())
        {
            throw new ValidationException(failures);
        }
        return await next();


    }
}
