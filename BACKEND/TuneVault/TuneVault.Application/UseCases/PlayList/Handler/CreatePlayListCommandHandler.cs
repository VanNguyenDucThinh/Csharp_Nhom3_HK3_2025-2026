using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class CreatePlayListCommandHandler:IRequestHandler<CreatePlayListCommand,PlayListDto>
{
    private readonly IPlayListRepository _playlist;
    private readonly IFileStorageService _file;

    public CreatePlayListCommandHandler(IPlayListRepository Playlist, IFileStorageService file)
    {
        _playlist=Playlist;
        _file=file;
    }

    public async Task<PlayListDto> Handle (CreatePlayListCommand request, CancellationToken cancellationToken)
    {
        var urlImage = await _file.UploadFileAsync(request.ImageFileStream, request.ImageFileName, "image_files",request.ImageContentType);
        //Tạo 1 playlist mới
        var newPlaylist = new PlayListEntities
        {
            Id=Guid.NewGuid(),
            Name=request.Name,
            IsPublic=request.IsPublic,
            Owner=request.Owner,
            CreatedDate=DateTime.UtcNow,
            UrlImage=urlImage

        };
        //Thêm vào database
        await _playlist.CreatePlayList(newPlaylist);
        //Trả về Dto
        return new PlayListDto()
        {
            Id=newPlaylist.Id,
            Name=request.Name,
            Owner=request.Owner,
            UrlImage=urlImage
        };
        


    } 

}
