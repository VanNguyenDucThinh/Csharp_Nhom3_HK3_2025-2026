using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;

namespace TuneVault.Application.UseCases.Handler;

public class CreatePlayListCommandHandler:IRequestHandler<CreatePlayListCommand,PlayListDto>
{
    private readonly IPlayListRepository _playlist;

    public CreatePlayListCommandHandler(IPlayListRepository Playlist)
    {
        _playlist=Playlist;
    }

    public async Task<PlayListDto> Handle (CreatePlayListCommand request, CancellationToken cancellationToken)
    {
        //Tạo 1 playlist mới
        var newPlaylist = new PlayList()
        {
            Id=Guid.NewGuid(),
            Name=request.Name,
            IsPublic=request.IsPublic,
            Owner=request.Owner,
            CreatedDate=DateTime.UtcNow

        };
        //Thêm vào database
        await _playlist.CreatePlayList(newPlaylist);
        //Trả về Dto
        return new PlayListDto()
        {
            Name=request.Name,
            IsPublic=request.IsPublic,
            Owner=request.Owner
        };
        


    } 

}
