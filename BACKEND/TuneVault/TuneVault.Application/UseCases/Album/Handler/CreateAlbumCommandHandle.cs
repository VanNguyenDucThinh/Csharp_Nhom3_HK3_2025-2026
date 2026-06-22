using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Album.Handler;

public class CreateAlbumCommandHandle : IRequestHandler<CreateAlbumCommand, AlbumDto>
{
    private readonly IAlbumRepository _album;
    private readonly ICurentUserService _curUser;
    private readonly IFileStorageService _file;
    public CreateAlbumCommandHandle(IAlbumRepository album, ICurentUserService curUser, IFileStorageService file)
    {
        _album = album;
        _curUser = curUser;
        _file=file;
    }

    public async Task<AlbumDto> Handle(CreateAlbumCommand request, CancellationToken cancellationToken)
    {
        var urlImage = await _file.UploadFileAsync(request.ImageFileStream, request.ImageFileName,"image_files",request.ImageContentType);
        var newAlbum = new TuneVault.Domain.Entities.Album
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            NameArtist = request.NameArtist,
            UrlImage = urlImage,
            Owner = _curUser.UserId          
        };

        var isSuccess = await _album.CreateAlbum(newAlbum);

        if (!isSuccess)
        {
            throw new Exception("Tạo Album thất bại. Vui lòng thử lại sau!");
        }
        return new AlbumDto
        {
            Id = newAlbum.Id,
            Name = newAlbum.Name,
            NameArtist = newAlbum.NameArtist,
            UrlImage = newAlbum.UrlImage
        };
    }
}