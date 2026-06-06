using System;

namespace Domain.Entity;

public class Album
{
    public Guid IdAlbum { get; set; }//khóa chính
    public string? Title { get; set; }//Ten album
    public DateTime ReleaseDate { get; set; }//Ngay phat hanh
    public string? CoverImageUrl { get; set; }//Duong dan den hinh anh bia album

}
