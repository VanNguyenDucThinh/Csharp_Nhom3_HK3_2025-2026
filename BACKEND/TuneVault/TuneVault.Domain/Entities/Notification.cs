using System;

namespace Domain.Entity;

public class Notification
{
    public Guid IdNotification { get; set; }//khoa chính
    public Guid IdUser { get; set; }//khoa ngoại, người nhận thông báo
    public string Type{ get; set; }//Loại thông báo (ví dụ: "MediaShare", "PlaylistUpdate", v.v.)
    public string Payload{ get; set; }//Nội dung chi tiết
    public bool IsRead { get; set; }=false;//Trạng thái đã đọc hay chưa

}
