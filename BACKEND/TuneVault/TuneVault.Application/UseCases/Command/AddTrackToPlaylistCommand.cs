using System;
using MediatR;
using TuneVault.Application.Security;

namespace TuneVault.Application.UseCases.Command;
[Authorize]
public class AddTrackToPlaylistCommand:IRequest<bool>
{
    public Guid IdTrack{get; set;}
    public Guid IdPlayList{get; set;}

    public AddTrackToPlaylistCommand(Guid idtrack, Guid idplaylist)
    {
        IdTrack=idtrack;
        IdPlayList=idplaylist;
        
    }

}
