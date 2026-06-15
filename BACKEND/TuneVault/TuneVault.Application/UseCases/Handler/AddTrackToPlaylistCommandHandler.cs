using System;
using MediatR;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Application.Interface;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Handler;

public class AddTrackToPlaylistCommandHandler:IRequestHandler<AddTrackToPlaylistCommand,bool>
{
    private readonly IPlayListTrackRepository _playListTrack;
    private readonly IPlayListRepository _playList;
    private readonly IMediaItemRepository _mediaItem;
    private readonly ICurrentUserService _curUserSer;

    public AddTrackToPlaylistCommandHandler(IPlayListTrackRepository PlayListTrack,IPlayListRepository PlayList,ICurrentUserService CurUserSer,IMediaItemRepository MediaItem)
    {
        _playListTrack=PlayListTrack;
        _curUserSer=CurUserSer;
        _playList=PlayList;
        _mediaItem=MediaItem;
    }

    public async Task<bool> Handle (AddTrackToPlaylistCommand request, CancellationToken cancellationtoken)
    {
        //Lấy Id người dùng từ JWT
        var currentUserId=Guid.Parse(_curUserSer.UserId!);
        //Kiểm tra người dùng có phải là chủ playlist không
        var playlist = await _playList.GetPlayListById(request.IdPlayList);
        if(playlist.Owner!=currentUserId)
        {
            throw new UnauthorizedAccessException("Không có quyền chỉnh sửa playlist người khác");
            
        }
        //Nếu là chủ kiểm tra có bài hát này không
        var media = await _mediaItem.GetMediaItemById(request.IdTrack);
        if(media==null)
        {
            throw new Exception("Không có bài hát này");
        }
        //Kiểm tra bài hát này có trong playlist chưa
        var isTrackExist = await _playListTrack.Exists(request.IdPlayList,request.IdTrack);
        if(isTrackExist)
        {
            throw new Exception("Bài này đã có trong playlist");
        }
        //Thêm track vào playlist
        var addTrack = new PlayListTrack
        {
            IdPlaylist=request.IdPlayList,
            IdMediaItem=request.IdTrack,
            AddAt=DateTime.UtcNow
        };
        //Lưu dô database
        await _playListTrack.AddTrackToPlaylist(addTrack);
        //trả về lưu thành công true

        return true;

        
    }

}
