using System;

namespace Domain.Entity;

public class Artist
{
    public Guid ArtistId { get; set; }//khóa chính
    public string? Name { get; set; }//Ten ca si
    public string? Bio { get; set; }//Tiểu sử ca si
    public string? ImageUrl { get; set; }//Duong dan den hinh anh ca si

}
