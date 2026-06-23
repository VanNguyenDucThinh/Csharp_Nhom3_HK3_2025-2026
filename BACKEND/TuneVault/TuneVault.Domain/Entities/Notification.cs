using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }//khoa chính
    public Guid IdUser { get; set; }//khoa ngoại, người nhận thông báo
    public TypeNotification Type{ get; set; }//Loại thông báo (ví dụ: "MediaShare", "PlaylistUpdate", v.v.)
    public Read IsRead{get; set;}
    public DateTime CreatAt{get; set;}
    public string Payload{ get; set; }//Nội dung chi tiết
    public Guid? IdItem{get; set;}//Chứa nội dung mà bấm dô chạy được

}
