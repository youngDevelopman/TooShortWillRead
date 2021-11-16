using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TooShortWillRead.Crawler.DataSources;
using TooShortWillRead.DAL;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.Crawler
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IDataSource _dataSource;
        private readonly IServiceProvider _serviceProvider;
        public Worker(ILogger<Worker> logger, IDataSource dataSource, IServiceProvider serviceProvider)
        {
            _logger = logger;
            _dataSource = dataSource;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var randomArticles = await _dataSource.GenerateRandomArticles();
                var articles = randomArticles.Select(article => 
                    new Article() 
                    {
                        DataSourceId = ((int)_dataSource.DataSource),
                        InternalId = article.InternalId,
                        Header = article.Header, 
                        Text = article.Text, 
                        ImageName = article.ImageUrl 
                    });

                using var scope = _serviceProvider.CreateScope();
                var dbContext =
                    scope.ServiceProvider
                        .GetRequiredService<ApplicationDbContext>();

                _logger.LogInformation($"Add {articles.Count()} articles...");
                await dbContext.Articles.AddRangeAsync(articles);
                await dbContext.SaveChangesAsync();
                _logger.LogInformation($"Articles have been added.");

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
