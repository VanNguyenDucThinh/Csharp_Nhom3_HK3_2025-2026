using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.DTOs;

public class NotificationDto
{
    public Guid Id{get; set;}
    public string payload{get; set;}
    public Read IsRead{get; set;}

}
