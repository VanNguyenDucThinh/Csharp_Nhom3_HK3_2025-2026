using System;
using TuneVault.Application.DTOs;
using MediatR;

namespace TuneVault.Application.UseCases.NotificationUser.Command;

public class GetNotificationQuery:IRequest<List<NotificationDto>>
{


}
