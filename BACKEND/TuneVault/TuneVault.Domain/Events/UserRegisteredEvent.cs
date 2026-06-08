using System;
using MediatR;

namespace TuneVault.Domain.Events;

public class UserRegisteredEvent:INotification
{
    public Guid UserId { get; set; }
    public string Email { get; set; }
    public string FullName { get; set; }

    public UserRegisteredEvent(Guid userId, string email, string fullName)
    {
        UserId = userId;
        Email = email;
        FullName = fullName;
    }

}
