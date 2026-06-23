using System;
using MediatR;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Application.DTOs;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;


namespace TuneVault.Application.UseCases.PlayList.Handler;

public class UpdatePlayListCommandHandler:IRequestHandler<UpdatePlayListCommand,bool>
{
    private readonly IPlayListRepository _playList;
    private readonly IFileStorageService _file; 
    private readonly ICurentUserService _curUser;

    public UpdatePlayListCommandHandler(IPlayListRepository playList, ICurentUserService curUser, IFileStorageService file)
    {
        _playList=playList;
        _curUser=curUser;
        _file=file;
    }

    public async Task<bool> Handle (UpdatePlayListCommand request, CancellationToken cancellationToken)
    {
        var playlist=await _playList.GetPlayListById(request.IdPlayList);
        if(playlist.Owner!=_curUser.UserId)
        {
            throw new UnauthorizedAccessException("Không thể sửa playlist của người khác");
        }
        playlist.Name=request.Name;
        playlist.IsPublic=request.IsPublic;
        var urlImage = await _file.UploadFileAsync(request.FileStream, request.FileName, "image_files", request.ContentType);

        var isSuccess=await _playList.UpdatePlayList(playlist);
        if (!isSuccess)
        {
            throw new Exception("Chỉnh sửa thất bại");
        }

        return true;

    }
}
