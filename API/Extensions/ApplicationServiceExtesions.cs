using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Interfaces;
using API.Data.Repository;
using API.Services;
using API.Helpers;
using AutoMapper;


namespace API.Extensions
{
  public static class ApplicationServiceExtesions
  {
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
      services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
      services.AddScoped<ITokenService, TokenService>();
      services.AddScoped<IPhotoService, PhotoService>();
      services.AddScoped<LogUserActivity>();
      services.AddScoped<IUserRepository, UserRepository>();
      services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
      services.AddDbContext<DataContext>(options =>
      {
        options.UseSqlite(config.GetConnectionString("DefaultConnection"));
      });
      return services;
    }
  }
}