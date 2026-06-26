using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Media.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Events;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.UseCases.Media.Handler;

public class UploadMediaCommandHandler : IRequestHandler<UploadMediaCommand, bool>
{
    private readonly IFileStorageService _fileStorage;
    private readonly ICurentUserService _curUser;
    private readonly IMediaItemRepository _mediaRepository;

    public UploadMediaCommandHandler(IMediaItemRepository mediaRepository, IFileStorageService fileStorage, ICurentUserService curUser)
    {
        _mediaRepository = mediaRepository;
        _fileStorage=fileStorage;
        _curUser=curUser;
    }

    public async Task<bool> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
    {
        //Tạo đường dẫn file
        string urlMedia = await _fileStorage.UploadFileAsync(request.FileStream,request.FileName,"media_files",request.ContentType);
        string urlImage="";
        if (request.ImageFileStream != null)
        {
            urlImage = await _fileStorage.UploadFileAsync(request.ImageFileStream,request.ImageFileName,"image_files",request.ImageContentType);
        }
        MediaStyle autoMediaStyle = request.ContentType.StartsWith("video/") ? MediaStyle.Video : MediaStyle.Audio;
        var mediaItem = new MediaItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Artist=request.Artist,
            Owner = _curUser.UserId,
            Description=request.Description,
            MediaStyle=autoMediaStyle,
            UrlMediaItem=urlMedia,
            UploadDateMediaItem=DateTime.UtcNow,
            Category=request.Category,
            UrlImageMedia=urlImage
        };
        //Lưu mediaItem vào database
        var isSuccess=await _mediaRepository.CreateMediaItem(mediaItem);
        if (!isSuccess)
        {
            throw new Exception("Không tạo được media");
        }
        //Trả về thông tin media đã được tải lên
        return true;

    }
}
