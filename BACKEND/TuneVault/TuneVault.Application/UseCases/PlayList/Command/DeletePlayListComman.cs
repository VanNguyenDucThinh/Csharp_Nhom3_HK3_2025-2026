using System;
using MediatR;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.PlayList.Command;

[Authorize]
public class DeletePlayListComman:IRequest<bool>
{
    public Guid IdPlaylist{get; set;}
    public DeletePlayListComman(Guid idPlaylist)
    {
        IdPlaylist=idPlaylist;
    }

}
