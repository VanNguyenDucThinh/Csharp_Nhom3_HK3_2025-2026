using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Events;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;


namespace TuneVault.Application.UseCases.Command;

public class UploadMediaCommand : IRequest<bool>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public MediaStyle MediaStyle { get; set; }
    public Category Category { get; set; }
    public Guid OwnerId { get; set; }

    //Lấy những dữ liệu cần thiết khi API rút ruột xong
    public string FileName{get; set;}
    public string ContentType{get; set;}
    public Stream FileStream{get; set;}

    public UploadMediaCommand(string title, Guid ownerId, string description, MediaStyle mediaStyle, Category category, string filename, string contenttype, Stream filestream)
    {
        Title = title;
        OwnerId = ownerId;
        Description = description;
        MediaStyle = mediaStyle;
        Category = category;
        FileName=filename;
        ContentType=contenttype;
        FileStream=filestream;
    }


}
