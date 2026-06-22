using System;
using TuneVault.Application.DTOs;
using MediatR;

namespace TuneVault.Application.UseCases.NotificationUser.Command;

public class MaskAsReadQuery:IRequest<bool>
{
    public Guid IdNotification{get; set;}

    public MaskAsReadQuery(Guid idNotification)
    {
        IdNotification=idNotification;
    }


}
