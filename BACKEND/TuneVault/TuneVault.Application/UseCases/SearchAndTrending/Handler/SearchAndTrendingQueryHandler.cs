using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.SearchAndTrending.Command;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Application.UseCases.SearchAndTrending.Handler;
public class SearchAndTrendingQueryHandler:IRequestHandler<SearchAndTrendingQuery, SearchTrendingDto>
{
    private readonly IMediaItemRepository _mediaItem;
    private readonly IPlayListRepository _playList;
    private readonly IPlayListTrackRepository _track;

    public SearchAndTrendingQueryHandler(IMediaItemRepository mediaItem, IPlayListRepository playList, IPlayListTrackRepository track)
    {
        _mediaItem=mediaItem;
        _playList=playList;
        _track=track;
    }

    public async Task<SearchTrendingDto> Handle(SearchAndTrendingQuery request, CancellationToken cancellationToken)
    {
        var page = new SearchTrendingDto
        {
            CurrentPage=request.PageNumber
            
        };

        int skip = (request.PageNumber - 1) * request.PageSize;
        int take = request.PageSize;

        if (request.IsTreading)
        {
            var listTrending = await _mediaItem.GetViewHigh(skip,take);
            page.Trending=listTrending.Select(x=>new MediaDto
            {
                Id=x.Id,
                Category=x.Category,
                Owner=x.Owner,
                Title=x.Title,
                UrlImage=x.UrlImageMedia,
                UrlMedia=x.UrlMediaItem
            }).ToList();
        }
        else
        {
            var listMedia = await _mediaItem.GetMediaItemByTitle(request.Title,skip,take);
            var listPlaylist = await _playList.GetPlayListByTitle(request.Title,skip, take);
            page.ListMedia=listMedia.Select(x=>new MediaDto
            {
                Id=x.Id,
                Category=x.Category,
                Owner=x.Owner,
                Title=x.Title,
                UrlImage=x.UrlImageMedia,
                UrlMedia=x.UrlMediaItem
            }).ToList();
            var playlistDtos = new List<PlayListDto>();

            // Dùng foreach để map và lấy danh sách Track cho từng Playlist một cách an toàn
            foreach (var p in listPlaylist)
            {
                var tracks = await _track.GetTracksInPlaylist(p.Id); 

                playlistDtos.Add(new PlayListDto
                {
                    Id = p.Id,
                    IsPublic = p.IsPublic,
                    Name = p.Name,
                    Owner = p.Owner,
                    // Map danh sách Track Entity sang DTO (Giả sử bạn có PlaylistTrackDto)
                    Track = tracks.Select(x=>new MediaDto
                    {
                        Id=x.Id,
                        Category=x.Category,
                        Owner=x.Owner,
                        Title=x.Title,
                        UrlImage=x.UrlImageMedia,
                        UrlMedia=x.UrlMediaItem
                    }).ToList()
                });

            page.ListPlayList = playlistDtos;
        }
        }
        return page;
    }

}
