using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.PlayList.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.PlayList.Handler;

public class CreatePlayListCommandHandler : IRequestHandler<CreatePlayListCommand, PlayListDto>
{
    private readonly IPlayListRepository _playlist;
    private readonly IFileStorageService _file;

    public CreatePlayListCommandHandler(IPlayListRepository Playlist, IFileStorageService file)
    {
        _playlist = Playlist;
        _file = file;
    }

    public async Task<PlayListDto> Handle(CreatePlayListCommand request, CancellationToken cancellationToken)
    {
        // Chỉ upload khi có file — không gọi UploadFileAsync với null
        string? urlImage = null;
        if (request.ImageFileStream != null)
        {
            urlImage = await _file.UploadFileAsync(
                request.ImageFileStream,
                request.ImageFileName,
                "image_files",
                request.ImageContentType
            );
        }

        var newPlaylist = new PlayListEntities
        {
            Id          = Guid.NewGuid(),
            Name        = request.Name,
            IsPublic    = request.IsPublic,
            Owner       = request.Owner,
            CreatedDate = DateTime.UtcNow,
            UrlImage    = urlImage
        };

        await _playlist.CreatePlayList(newPlaylist);

        return new PlayListDto()
        {
            Id       = newPlaylist.Id,
            Name     = request.Name,
            Owner    = request.Owner,
            UrlImage = urlImage
        };
    }
}