using System;
using System.Collections.Generic;
using System.Net.Http;
using AngleSharp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Services.DataSources;
using TooShortWillRead.Crawler.ArticlesGenerators;
using TooShortWillRead.Crawler.Config;

namespace TooShortWillRead.Crawler
{
    public static class ArticlesGeneratorsCollectionExtensions
    {
        public static IServiceCollection AddArticlesGenerators(
            this IServiceCollection services,
            Microsoft.Extensions.Configuration.IConfiguration configuration)
        { 
            var dataSourcesToRun = configuration.GetSection("Crawler:DataSourcesToRun").Get<string[]>();

            if(dataSourcesToRun.Length != 0)
            {
                services.AddSingleton<IBrowsingContext>(serviceProvider => BrowsingContext.New(AngleSharp.Configuration.Default));
                services.AddHttpClient();
                services.AddSingleton<IDataSourceFactory, DataSourceFactory>();
            }

            foreach (var dataSource in dataSourcesToRun)
            {
                switch(dataSource)
                {
                    case "Britannica":
                        RegisterBritaniccaServices(services, configuration);
                        break;
                }
            }

            return services;
        }

        private static void RegisterBritaniccaServices(
            IServiceCollection services,
            Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            services.Configure<BritannicaGeneretorConfig>(configuration.GetSection($"Crawler:Britannica"));
            var baseUrl = configuration.GetSection("Crawler:Britannica:BaseUrl").Get<string>();

            services.AddHttpClient("Britannica", httpClient =>
            {
                httpClient.BaseAddress = new Uri(baseUrl);
            });

            services.AddTransient<IArticlesGenerator>(serviceProvider =>
            {
                var httpClientFactory = serviceProvider.GetRequiredService<IHttpClientFactory>();
                var httpClient = httpClientFactory.CreateClient("Britannica");

                var browsingContext = serviceProvider.GetRequiredService<IBrowsingContext>();
                var logger = serviceProvider.GetRequiredService<ILogger<BritannicaDataSource>>();
                var dataSource = new BritannicaDataSource(httpClient, browsingContext, logger);


                var options = serviceProvider.GetRequiredService<IOptions<BritannicaGeneretorConfig>>();
                var generator = new BritannicaArticlesGenerator(browsingContext, dataSource, httpClient, options);

                return generator;
            });
        }
    }
}

