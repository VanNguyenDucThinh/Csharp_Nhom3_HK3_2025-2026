using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace TuneVault.Infrastructure.SignalR
{
    [Authorize] //Xác thực danh tính(JWT) mới kết nối đến Hub
    public class NotificationHub : Hub //kế thừa từ thư viện SignalR có sẵn
    {
        public override async Task OnConnectedAsync() //kích hoạt khi client kết nối thành công
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception) //kích hoạt khi user ngắt kết nối 
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
