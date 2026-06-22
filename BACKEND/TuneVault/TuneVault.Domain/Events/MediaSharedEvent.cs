using System;
using MediatR;

namespace TuneVault.Domain.Events;

public class MediaSharedEvent:INotification
{
    public Guid SenderId { get; set; }
    public Guid ReceiverId { get; set; }
    public string TitleItem{get; set;}
    public Guid ItemId{get; set;}


    public MediaSharedEvent(string titleItem, Guid senderId, Guid receiverId, Guid itemId)
    {
        SenderId=senderId;
        ReceiverId=receiverId;
        TitleItem=titleItem;
        ItemId=itemId;
    }

}
