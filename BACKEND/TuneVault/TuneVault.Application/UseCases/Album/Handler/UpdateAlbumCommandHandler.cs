using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Album.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Album.Handler;

public class UpdateAlbumCommandHandler:IRequestHandler<UpdateAlbumCommand, bool>
{
    private readonly IAlbumRepository _album;
    private readonly ICurentUserService _curUser;
    private readonly IFileStorageService _file;
    public UpdateAlbumCommandHandler(IAlbumRepository album, ICurentUserService curUser, IFileStorageService file)
    {
        _album = album;
        _curUser = curUser;
        _file=file;
    }

    public async Task<bool> Handle(UpdateAlbumCommand request, CancellationToken cancellationToken)
    {
        var album = await _album.GetAlbum(request.Id);
        if (album.Owner != _curUser.UserId)
        {
            throw new Exception("Không phải thể sửa Album này");
        }
        album.Name = request.Name;
        album.NameArtist = request.NameArtist;
        if (request.ImageFileStream != null && request.ImageFileStream.Length > 0)
        {
            var newImageUrl = await _file.UploadFileAsync(
                request.ImageFileStream, 
                request.ImageFileName,
                "image_files", 
                request.ImageContentType);

            album.UrlImage = newImageUrl;
        }
        var isSuccess = await _album.UpdateAlbum(album);
        
        if (!isSuccess)
        {
            throw new Exception("Cập nhật Album thất bại. Vui lòng thử lại sau!");
        }

        return true;

    }

}
