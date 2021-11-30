using AngleSharp;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Services;
using TooShortWillRead.Crawler.DataSources;
using TooShortWillRead.Crawler.DataSources.Wikipedia;
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

                    services.AddTransient<IBrowsingContext>(serviceProvider => BrowsingContext.New(Configuration.Default));
                    services.AddTransient<IDataSource, BritannicaDataSource>();
                    services.AddTransient<IPictureStorage, AzureBlobPictureStorage>();
                    services.AddHttpClient();

                    services.AddHostedService<Worker>();
                });
    }
}
