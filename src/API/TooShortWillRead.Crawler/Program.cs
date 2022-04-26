using AngleSharp;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TooShortWillRead.BL.Configuration;
using TooShortWillRead.BL.Extensions.DependencyInjection;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Services;
using TooShortWillRead.BL.Services.DataSources;
using TooShortWillRead.DAL;
using TooShortWillRead.Web.Api.Services;

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
                    var t = hostContext.Configuration.GetSection("ArticlePictures");
                    services.Configure<ArticlePictures>(hostContext.Configuration.GetSection("ArticlePictures"));

                    services.AddDataSources();
                    services.AddTransient<IPictureStorage, AzureBlobPictureStorage>();
                    services.AddTransient<IArticleService>(serviceProvider =>
                    {;
                        using (var scope = serviceProvider.CreateScope())
                        {
                            var dbConext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                            var pictureStorage = scope.ServiceProvider.GetRequiredService<IPictureStorage>();
                            var dataSourceFactory = scope.ServiceProvider.GetRequiredService<IDataSourceFactory>();
                            var config = scope.ServiceProvider.GetRequiredService<IOptions<ArticlePictures>>();
                            var logger = scope.ServiceProvider.GetRequiredService<ILogger<ArticleService>>();
                            return new ArticleService(dbConext, pictureStorage, dataSourceFactory, config, logger);
                        }

                    });
                    services.AddHttpClient();

                    services.AddHostedService<Worker>();
                });
    }
}
