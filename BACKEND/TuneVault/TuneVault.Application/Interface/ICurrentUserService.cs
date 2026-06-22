using System;

namespace TuneVault.Application.Interface;

public interface ICurrentUserService//ở trên tầng API có sử dụng HttpContext gửi xuống đây 
{
    string? UserId {get; }

}
