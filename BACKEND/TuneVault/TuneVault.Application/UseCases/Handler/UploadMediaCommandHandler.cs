using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Events;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Handler;

public class UploadMediaCommandHandler : IRequestHandler<UploadMediaCommand, MediaDto>
{
    private readonly IMediaItemRepository _mediaRepository;

    public UploadMediaCommandHandler(IMediaItemRepository mediaRepository)
    {
        _mediaRepository = mediaRepository;
    }

    public async Task<MediaDto> Handle(UploadMediaCommand request, CancellationToken cancellationToken)
    {
        var mediaItem = new MediaItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Duration = request.Duration,
            Owner = request.OwnerId,
            Description=request.Description,
            MediaStyle=request.MediaStyle,
            UrlMediaItem=request.UrlMediaItem,
            UploadDateMediaItem=DateTime.UtcNow,
            Category=request.Category
        };
        //Lưu mediaItem vào database
        await _mediaRepository.CreateMediaItem(mediaItem);
        //Trả về thông tin media đã được tải lên
        return new MediaDto
        {
            Id = mediaItem.Id,
            Title = mediaItem.Title,
            Duration = mediaItem.Duration,
            Owner = mediaItem.Owner

        };

    }
}
