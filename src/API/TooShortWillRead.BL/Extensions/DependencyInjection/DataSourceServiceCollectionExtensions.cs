using AngleSharp;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Services.DataSources;

namespace TooShortWillRead.BL.Extensions.DependencyInjection
{
    public static class DataSourceServiceCollectionExtensions
    {
        public static IServiceCollection AddDataSources(this IServiceCollection services)
        {
            services.AddTransient<IBrowsingContext>(serviceProvider => BrowsingContext.New(AngleSharp.Configuration.Default));

            services.AddHttpClient<BritannicaDataSource>(config =>
            {
                config.BaseAddress = new Uri("https://www.britannica.com");
            });
            services.AddHttpClient<WikipediaDataSource>(config =>
            {
                config.BaseAddress = new Uri("https://en.wikipedia.org");
            });

            services.AddTransient<IDataSourceFactory, DataSourceFactory>();

            return services;
        }
    }
}
