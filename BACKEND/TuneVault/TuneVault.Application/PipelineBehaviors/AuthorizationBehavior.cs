using System;
using MediatR;
using System.Reflection;
using FluentValidation;
using TuneVault.Application.Interface;
using TuneVault.Application.Security;
namespace TuneVault.Application.PipelineBehaviors;

public class AuthorizationBehavior<TRequest, TResponse>:IPipelineBehavior<TRequest, TResponse>
where TRequest : notnull
{
    private readonly ICurrentUserService _currentUserService;

    public AuthorizationBehavior(ICurrentUserService CurrentUserService)
    {
        _currentUserService=CurrentUserService;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        //soi gương coi nó có nhãn không
        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();
        //nếu có nhãn 
        if (authorizeAttributes.Any())
        {
            //nếu nó rỗng thì quăng ra lỗi
            if (string.IsNullOrEmpty(_currentUserService.UserId))
            {
                throw new UnauthorizedAccessException("Bạn chưa đăng nhập hoặc token không hợp lệ.");
            }
        }
        return await next();
        
    }



}
