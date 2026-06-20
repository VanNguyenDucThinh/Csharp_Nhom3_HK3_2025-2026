using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.DTOs;

public class NotificationDto
{
    public Guid Id { get; set; }
    public string Payload { get; set; }
    public TypeNotification Type { get; set; }
    public DateTime CreatAt { get; set; }
    public bool IsRead { get; set; }
    public Guid? IdItem { get; set; }
}