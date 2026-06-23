using System;
using MediatR;
using TuneVault.Application.Security;


namespace TuneVault.Application.UseCases.PlayList.Command;
[Authorize]
public class RemoveTrackFromPlaylistCommand:IRequest<bool>
{
    public Guid IdPlayList{get; set;}
    public Guid IdTrack{get; set;}

    public RemoveTrackFromPlaylistCommand(Guid idPlayList, Guid idTrack)
    {
        IdPlayList=idPlayList;
        IdTrack=idTrack;
    }

}
