using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Events;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;


namespace TuneVault.Application.UseCases.Command;

public class UploadMediaCommand : IRequest<MediaDto>
{
    public string Title { get; set; }
    public TimeSpan Duration { get; set; }
    public string Description { get; set; }
    public MediaStyle MediaStyle { get; set; }
    public string UrlMediaItem { get; set; }
    public DateTime UploadDateMediaItem { get; set; }
    public Category Category { get; set; }
    public Guid OwnerId { get; set; }

    public UploadMediaCommand(string title, TimeSpan duration, Guid ownerId, string description, MediaStyle mediaStyle, string urlMediaItem, DateTime uploadDateMediaItem, Category category)
    {
        Title = title;
        Duration = duration;
        OwnerId = ownerId;
        Description = description;
        MediaStyle = mediaStyle;
        UrlMediaItem = urlMediaItem;
        UploadDateMediaItem = uploadDateMediaItem;
        Category = category;
    }


}
