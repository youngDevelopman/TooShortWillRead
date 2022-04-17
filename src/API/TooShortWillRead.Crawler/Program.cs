using AngleSharp;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TooShortWillRead.BL.Extensions.DependencyInjection;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Services;
using TooShortWillRead.BL.Services.DataSources;
using TooShortWillRead.DAL;

namespace TooShortWillRead.Crawler
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    services.AddDbContext<ApplicationDbContext>(options =>
                        options.UseSqlServer(hostContext.Configuration.GetConnectionString("DefaultConnection")));

                    services.AddDataSources();
                    services.AddTransient<IPictureStorage, AzureBlobPictureStorage>();
                    services.AddHttpClient();

                    services.AddHostedService<Worker>();
                });
    }
}
