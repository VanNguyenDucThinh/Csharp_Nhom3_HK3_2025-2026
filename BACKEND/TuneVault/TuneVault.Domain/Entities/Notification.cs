using System;
using TuneVault.Domain.Enums;

namespace TuneVault.Domain.Entities;

public class Notification
{
    public Guid Id { get; set; }//khoa chính
    public Guid IdUser { get; set; }//khoa ngoại, người nhận thông báo
    public TypeNotification Type{ get; set; }//Loại thông báo (ví dụ: "MediaShare", "PlaylistUpdate", v.v.)
    public string Payload{ get; set; }//Nội dung chi tiết

}
