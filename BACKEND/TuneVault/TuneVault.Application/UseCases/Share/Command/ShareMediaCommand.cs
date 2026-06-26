using System;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Enums;
using MediatR;

namespace TuneVault.Application.UseCases.Share.Command;

public class ShareMediaCommand:IRequest<ShareMediaDto>
{
    public Guid IdReceiver { get; set; }
    public Guid IdItem {get; set;}

    public ShareMediaCommand(Guid idreceiver, Guid iditem)
    {
        IdReceiver=idreceiver;
        IdItem=iditem;
    }


}
