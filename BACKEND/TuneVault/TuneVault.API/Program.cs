using TuneVault.API.Extensions;
using TuneVault.API.Hubs;
using TuneVault.API.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// ── Đăng ký services ────────────────────────────────────────────────
builder.Services.AddWebApiServices(builder.Configuration);

// Chờ team làm xong thì mở comment 2 dòng này:
// builder.Services.AddApplicationServices();
// builder.Services.AddInfrastructureServices(builder.Configuration);

// ── Build app ───────────────────────────────────────────────────────
var app = builder.Build();

// ── Middleware pipeline (thứ tự quan trọng!) ────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TuneVault API v1");
        options.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();
app.UseCors("CorsPolicy");       // ← phải trước Authentication
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();
