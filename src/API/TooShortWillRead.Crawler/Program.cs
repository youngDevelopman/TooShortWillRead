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
                    services.AddDbContextFactory<ApplicationDbContext>(options =>
                        options.UseSqlServer(hostContext.Configuration.GetConnectionString("DefaultConnection")));
                    var t = hostContext.Configuration.GetSection("ArticlePictures");
                    services.Configure<ArticlePictures>(hostContext.Configuration.GetSection("ArticlePictures"));

                    services.AddDataSources();
                    services.AddArticlesGenerators(hostContext.Configuration);
                    services.AddTransient<IPictureStorage, AzureBlobPictureStorage>();
                    services.AddTransient<IArticleService, ArticleService>();
                    services.AddHttpClient();

                    services.AddHostedService<Worker>();
                });
    }
}
