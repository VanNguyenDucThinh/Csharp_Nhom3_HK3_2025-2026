using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Events;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;

namespace TuneVault.Application.UseCases.Handler;

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
        //Tạo đường dẫn file media
        string urlMedia = await _fileStorage.UploadFileAsync(request.FileStream,request.FileName,"media_files",request.ContentType);
        //Phân loại mediastyle
        MediaStyle autoMediaStyle = request.ContentType.StartsWith("video/") ? MediaStyle.Video : MediaStyle.Audio;
        var mediaItem = new MediaItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Owner = request.OwnerId,
            Description=request.Description,
            MediaStyle=autoMediaStyle,
            UrlMediaItem=urlMedia,
            UploadDateMediaItem=DateTime.UtcNow,
            Category=request.Category
        };
        //Lưu mediaItem vào database
        await _mediaRepository.CreateMediaItem(mediaItem);
        //Trả về thông tin media đã được tải lên
        return true;

    }
}
