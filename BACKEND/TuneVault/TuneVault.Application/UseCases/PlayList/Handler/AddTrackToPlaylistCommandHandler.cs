using System;
using MediatR;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Application.CreateException;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class AddTrackToPlaylistCommandHandler:IRequestHandler<AddTrackToPlaylistCommand,bool>
{
    private readonly IPlayListTrackRepository _playListTrack;
    private readonly IPlayListRepository _playList;
    private readonly IMediaItemRepository _mediaItem;
    private readonly ICurentUserService _curUserSer;

    public AddTrackToPlaylistCommandHandler(IPlayListTrackRepository PlayListTrack,IPlayListRepository PlayList,ICurentUserService CurUserSer,IMediaItemRepository MediaItem)
    {
        _playListTrack=PlayListTrack;
        _curUserSer=CurUserSer;
        _playList=PlayList;
        _mediaItem=MediaItem;
    }

    public async Task<bool> Handle (AddTrackToPlaylistCommand request, CancellationToken cancellationtoken)
    {
        //Lấy Id người dùng từ JWT
        var currentUserId=_curUserSer.UserId;
        //Kiểm tra người dùng có phải là chủ playlist không
        var playlist = await _playList.GetPlayListById(request.IdPlayList);
        if(playlist == null)
        {
            throw new NotFoundException("Không tìm thấy Playlist này");
        }
        if(playlist.Owner!=currentUserId)
        {
            throw new UnauthorizedAccessException("Không có quyền chỉnh sửa playlist người khác");
            
        }
        //Nếu là chủ kiểm tra có bài hát này không
        var media = await _mediaItem.GetAudioById(request.IdTrack);
        if(media==null)
        {
            throw new NotFoundException("Không có bài hát này");
        }
        //Kiểm tra bài hát này có trong playlist chưa
        var isTrackExist = await _playListTrack.Exists(request.IdPlayList,request.IdTrack);
        if(isTrackExist)
        {
            throw new BadRequestException("Bài này đã có trong playlist");
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
