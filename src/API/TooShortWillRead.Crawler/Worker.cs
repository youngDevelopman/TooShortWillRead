using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models.Request;

namespace TooShortWillRead.Crawler
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IDataSourceFactory _dataSourceFactory;
        private readonly IArticleService _articleService;
        public Worker(
            ILogger<Worker> logger,
            IDataSourceFactory dataSourceFactory,
            IArticleService articleService)
        {
            _logger = logger;
            _dataSourceFactory = dataSourceFactory;
            _articleService = articleService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var sourcingTasks = new List<Task>();
            foreach (var dataSource in _dataSourceFactory.GetAllDataSources())
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
                var randomArticles = await dataSource.GenerateRandomArticlesAsync();
                var request = new UploadArticleFromDataSourceRequest()
                {
                    Articles = randomArticles,
                };

                await _articleService.UploadArticleFromDataSourceAsync(request);

                await Task.Delay(1000, stoppingToken);
            }
            _logger.LogInformation($"=====END SOURCING FOR {dataSource.DataSource}=====");
        }
    }
}
