namespace TuneVault.API.Common;

/// <summary>
/// Response wrapper chuẩn hóa cho toàn bộ API.
/// Format: { success, message, data, errors }
/// </summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    // Constructor mặc định
    public ApiResponse() { }


    // Constructor nhận data
    public ApiResponse(T data)
    {
        Success = true;
        Data = data;
    }

    // Constructor nhận data + message
    public static ApiResponse<T> Ok(T data, string? message = null) => new()
    {
        Success = true,
        Message = message,
        Data    = data
    };

    public static ApiResponse<T> Fail(string message, IEnumerable<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors  = errors
    };
}

/// <summary>
/// Response không có data payload (dùng cho các action chỉ trả thông báo).
/// </summary>
public class ApiResponse : ApiResponse<object>
{
    public static ApiResponse Ok(string? message = null) => new()
    {
        Success = true,
        Message = message
    };

    public new static ApiResponse Fail(string message, IEnumerable<string>? errors = null) => new()
    {
        Success = false,
        Message = message,
        Errors  = errors
    };
}