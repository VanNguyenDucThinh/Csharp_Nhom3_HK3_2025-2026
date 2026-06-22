using System;
using FluentValidation;
using TuneVault.Application.UseCases.NotificationUser.Command;

namespace TuneVault.Application.Validators;

public class GetNotificationQueryValidator:AbstractValidator<GetNotificationQuery>
{
    public GetNotificationQueryValidator()
    {
    }

}