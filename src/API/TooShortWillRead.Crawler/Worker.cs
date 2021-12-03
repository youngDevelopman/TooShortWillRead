using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.Crawler.DataSources;
using TooShortWillRead.DAL;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.Crawler
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IEnumerable<IDataSource> _dataSources;
        private readonly IPictureStorage _picturesStorage;
        private readonly IServiceProvider _serviceProvider;
        public Worker(
            ILogger<Worker> logger,
            IEnumerable<IDataSource> dataSources, 
            IPictureStorage picturesStorage, 
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _dataSources = dataSources;
            _picturesStorage = picturesStorage;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var sourcingTasks = new List<Task>();
            foreach (var dataSource in _dataSources)
            {
                sourcingTasks.Add(Task.Run(() => StartSourcingAsync(dataSource, stoppingToken)));
            }

            await Task.WhenAll(sourcingTasks);
        }


        private async Task StartSourcingAsync(IDataSource dataSource, CancellationToken stoppingToken)
        {
            _logger.LogInformation($"=====START SOURCING FOR {dataSource.DataSource}=====");
            while (!stoppingToken.IsCancellationRequested)
            {
                var randomArticles = await dataSource.GenerateRandomArticles();

                await AddOrUpdateArticles(randomArticles, dataSource.DataSource);

                await Task.Delay(1000, stoppingToken);
            }
            _logger.LogInformation($"=====END SOURCING FOR {dataSource.DataSource}=====");
        }

        private async Task AddOrUpdateArticles(List<DataSourceArticle> articles, DataSourceEnum dataSource)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext =
            scope.ServiceProvider
                .GetRequiredService<ApplicationDbContext>();

            var articlesToUpdate = new List<DataSourceArticle>();
            var articlesToAdd = new List<DataSourceArticle>();
            foreach (var article in articles)
            {
                if(dbContext.Articles.Any(a => a.DataSourceId == (int)dataSource && a.InternalId == article.InternalId))
                {
                    articlesToUpdate.Add(article);
                }
                else
                {
                    articlesToAdd.Add(article);
                }
            }

            await AddArticles(dbContext, articlesToAdd, dataSource);
            await UpdateArticles(dbContext, articlesToUpdate, dataSource);
        }

        private async Task AddArticles(ApplicationDbContext context, List<DataSourceArticle> articles, DataSourceEnum dataSource)
        {
            // Add record to the database
            var mappedArticles = MapDataSourceArticlesToDbModel(articles, dataSource);
            _logger.LogInformation($"Add {articles.Count()} articles to the database...");
            await context.Articles.AddRangeAsync(mappedArticles);
            await context.SaveChangesAsync();

            // Add images
            _logger.LogInformation($"Add images");
            var imageUrls = articles.Select(article => new Uri(article.ImageUrl));
            await _picturesStorage.UploadAsync(imageUrls.ToList());

            _logger.LogInformation($"Articles have been added.");
        }

        private async Task UpdateArticles(ApplicationDbContext context, List<DataSourceArticle> articles, DataSourceEnum dataSource)
        {
            // Update record in the database
            var articlesInDb = articles.Select(a => 
                context.Articles.First(
                    dbArticle => dbArticle.DataSourceId == (int)dataSource && dbArticle.InternalId == a.InternalId));

            var updatedArticles = articlesInDb.Select(a =>
            {
                var articleToUpdateFrom = articles.First(ar => ar.InternalId == a.InternalId);
                a.Header = articleToUpdateFrom.Header;
                a.ImageName = Path.GetFileName(articleToUpdateFrom.ImageUrl);
                a.Text = articleToUpdateFrom.Text;

                return a;
            });

            _logger.LogInformation($"Update {articles.Count()} articles in the database...");
            context.Articles.UpdateRange(updatedArticles);
            await context.SaveChangesAsync();

            // Update images
            _logger.LogInformation($"Update images");
            var imageUrls = articles.Select(article => new Uri(article.ImageUrl));
            await _picturesStorage.UploadAsync(imageUrls.ToList());

            _logger.LogInformation($"Articles have been updated.");
        }

        private List<Article> MapDataSourceArticlesToDbModel(List<DataSourceArticle> articles, DataSourceEnum dataSource)
        {
            var mapped = articles.Select(article =>
                new Article()
                {
                    DataSourceId = ((int)dataSource),
                    InternalId = article.InternalId,
                    Header = article.Header,
                    Text = article.Text,
                    ImageName = Path.GetFileName(article.ImageUrl),
                });

            return mapped.ToList();
        }
    }
}
