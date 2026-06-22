using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;
using TuneVault.Application.PipelineBehaviors;

namespace TuneVault.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Đăng ký TẤT CẢ các class Validator trong thư mục Validators của bạn
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            //Đăng ký MediatR và gắn các Pipeline Behaviors
            services.AddMediatR(cfg =>
            {
                // Đăng ký các Handler
                cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());

                
                //Chạy Authorization trước (kiểm tra quyền)
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehavior<,>));

                // Chạy Validation (kiểm tra dữ liệu hợp lệ)
                cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            });

            return services;
        }
    }
}