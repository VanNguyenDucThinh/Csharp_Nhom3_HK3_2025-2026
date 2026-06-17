using System;
using MediatR;

namespace TuneVault.Domain.Events;

public class SaveHistoryEvent:INotification
{
    public Guid IdUser{get; set;}
    public Guid IdMediaItem{get; set;}

    public SaveHistoryEvent(Guid idUser, Guid idMediaItem)
    {
        IdUser=idUser;
        IdMediaItem=idMediaItem;
    }

}
