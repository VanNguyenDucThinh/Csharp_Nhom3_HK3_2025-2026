using TuneVault.API.Extensions;
using TuneVault.API.Hubs;
using TuneVault.API.Middlewares;
using TuneVault.Application;
using TuneVault.Infrastructure;
using TuneVault.Infrastructure.Services.JWT;

var builder = WebApplication.CreateBuilder(args);
;

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// ── Đăng ký services ────────────────────────────────────────────────────────
builder.Services.AddWebApiServices(builder.Configuration);
//builder.Services.AddWebApiServices(builder.Configuration);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplicationServices();


// ── Build app ────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Middleware pipeline (thứ tự quan trọng!) ────────────────────────────────
// 1. Global exception handler — phải đứng đầu để bắt mọi lỗi
app.UseMiddleware<GlobalExceptionMiddleware>();

// 2. Swagger — chỉ trong Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TuneVault API v1");
        options.RoutePrefix          = "swagger";
        options.DisplayRequestDuration();           // hiển thị thời gian response
        options.EnableTryItOutByDefault();           // mở sẵn Try it out
        options.DefaultModelsExpandDepth(-1);        // ẩn schema mặc định
    });
}

// 3. HTTPS redirect
app.UseHttpsRedirection();

// 4. Static files (phục vụ file upload từ wwwroot/uploads)
app.UseStaticFiles();

// 5. CORS — phải trước Authentication
app.UseCors("CorsPolicy");

// 6. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// ── Endpoints ────────────────────────────────────────────────────────────────
app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

// ── Health check đơn giản ────────────────────────────────────────────────────
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
   .WithTags("Health")
   .AllowAnonymous();

app.Run();