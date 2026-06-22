using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.SearchAndTrending.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.SearchAndTrending.Handler;
public class SearchAndTrendingQueryHandler:IRequestHandler<SearchAndTrendingQuery, SearchTrendingDto>
{
    private readonly IMediaItemRepository _mediaItem;
    private readonly IAlbumRepository _album;
    private readonly IPlayListRepository _playList;
    private readonly IPlayListTrackRepository _track;

    public SearchAndTrendingQueryHandler(IMediaItemRepository mediaItem, IPlayListRepository playList, IPlayListTrackRepository track, IAlbumRepository album)
    {
        _mediaItem=mediaItem;
        _playList=playList;
        _track=track;
        _album=album;
    }

    public async Task<SearchTrendingDto> Handle(SearchAndTrendingQuery request, CancellationToken cancellationToken)
    {
        var page = new SearchTrendingDto
        {
            CurrentPage=request.PageNumber
            
        };

        int skip = (request.PageNumber - 1) * request.PageSize;
        int take = request.PageSize;
        var listMedia = await _mediaItem.GetMediaItemByTitle(request.Title,skip,take);
        var listMediaByArtist = await _mediaItem.GetAudioByArtist(request.Title);
        var listPlaylist = await _playList.GetPlayListByTitle(request.Title,skip, take);
        var listAlbum = await _album.GetAlbumByTitle(request.Title, skip, take);
        page.ListMedia=listMedia.Select(x=>new MediaDto
        {
            Id=x.Id,
            Category=x.Category,
            Owner=x.Owner,
            Title=x.Title,
            Artist=x.Artist,
            UrlImage=x.UrlImageMedia
        }).ToList();
        page.ListPlayList=listPlaylist.Select(x=>new PlayListDto
        {
            Id=x.Id,
            Name=x.Name,
            Owner=x.Owner,
            UrlImage=x.UrlImage
        }).ToList();

        // var playlistDtos = new List<PlayListDto>();
        //     foreach (var p in listPlaylist)
        //     {
        //         var tracks = await _track.GetTracksInPlaylist(p.Id); 

        //         playlistDtos.Add(new PlayListDto
        //         {
        //             Id = p.Id,
        //             Name = p.Name,
        //             Owner = p.Owner,
        //             Track = tracks.Select(x=>new MediaDto
        //             {
        //                 Id=x.Id,
        //                 Category=x.Category,
        //                 Owner=x.Owner,
        //                 Title=x.Title,
        //                 Artist=x.Artist,
        //                 UrlImage=x.UrlImageMedia
        //             }).ToList()
        //         });

        //     page.ListPlayList = playlistDtos;
        // }
        page.ListMediaByArtist=listMediaByArtist.Select(x=>new MediaDto
        {
            Id=x.Id,
            Category=x.Category,
            Owner=x.Owner,
            Title=x.Title,
            Artist=x.Artist,
            UrlImage=x.UrlImageMedia
        }).ToList();
        page.ListAlbum=listAlbum.Select(x=>new AlbumDto
        {
            Id=x.Id,
            Name=x.Name,
            NameArtist=x.NameArtist,
            UrlImage=x.UrlImage
        }).ToList();
        return page;
    } 
        
}
