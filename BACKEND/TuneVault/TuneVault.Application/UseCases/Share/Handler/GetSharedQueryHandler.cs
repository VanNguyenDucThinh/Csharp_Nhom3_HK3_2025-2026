using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Share.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;


namespace TuneVault.Application.UseCases.Share.Handler;

public class GetSharedQueryHandler:IRequestHandler<GetSharedQuery, List<SharedItemDto>>
{
    private readonly IMediaShareRepository _mediaShare;
    private readonly ICurentUserService _curUser;

    public GetSharedQueryHandler(IMediaShareRepository MediaShare, ICurentUserService CurUser)
    {
        _mediaShare=MediaShare;
        _curUser=CurUser;
    }
    public async Task<List<SharedItemDto>>Handle(GetSharedQuery request, CancellationToken cancellationToken)
    {
        var listShare = await _mediaShare.GetSharedByIdUser(_curUser.UserId);

        var result = listShare.Select(share=>{var dto = new SharedItemDto
        {
           IdSender=share.IdSender,
           ShareAt=share.ShareAt 
        };
        if(share.MediaItem!=null)
            {
                dto.Title=share.MediaItem.Title;
                dto.IdItem=share.MediaItem.Id;
                dto.UrlImage=share.MediaItem.UrlImageMedia;
                dto.ShareStyle=ShareStyle.Media;
            }
        else if(share.PlayList!=null)
            {
                dto.Title=share.PlayList.Name;
                dto.UrlImage=share.PlayList.UrlPlayList;
                dto.ShareStyle=ShareStyle.Playlist;
                
            }
            return dto;
        }).ToList();

        return result;
        
    }

}
