using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Media.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Events;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Enums;
using TuneVault.Application.Security;


namespace TuneVault.Application.UseCases.Media.Command;
[Authorize]

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
    //Lấy dữ liệu ảnh 
    public string? ImageFileName{get; set;}
    public string? ImageContentType{get; set;}
    public Stream? ImageFileStream{get; set;}

    public UploadMediaCommand(string title, Guid ownerId, string description, MediaStyle mediaStyle, Category category, string filename, string contenttype, Stream filestream,string? imageFileName,string? imageContentType,Stream? imageFileStream)
    {
        Title = title;
        OwnerId = ownerId;
        Description = description;
        MediaStyle = mediaStyle;
        Category = category;
        FileName=filename;
        ContentType=contenttype;
        FileStream=filestream;
        ImageFileName=imageFileName;
        ImageContentType=imageContentType;
        ImageFileStream=imageFileStream;
    }


}
