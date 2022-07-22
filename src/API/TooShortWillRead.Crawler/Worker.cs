using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models.Request;
using TooShortWillRead.Crawler.ArticlesGenerators;

namespace TooShortWillRead.Crawler
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IEnumerable<IArticlesGenerator> _articlesGenerators;
        private readonly IArticleService _articleService;
        public Worker(
            ILogger<Worker> logger,
            IEnumerable<IArticlesGenerator> articlesGenerators,
            IArticleService articleService)
        {
            _logger = logger;
            _articlesGenerators = articlesGenerators;
            _articleService = articleService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var sourcingTasks = new List<Task>();
            foreach (var articlesGenerator in _articlesGenerators)
            {
                sourcingTasks.Add(Task.Run(() => StartSourcingAsync(articlesGenerator, stoppingToken)));
            }

            await Task.WhenAll(sourcingTasks);
        }


        private async Task StartSourcingAsync(IArticlesGenerator articlesGenerator, CancellationToken stoppingToken)
        {
            //_logger.LogInformation($"=====START SOURCING FOR {dataSource.DataSource}=====");
            while (!stoppingToken.IsCancellationRequested)
            {
                var randomArticles = await articlesGenerator.GenerateArticlesAsync();
                var request = new UploadArticleFromDataSourceRequest()
                {
                    Articles = randomArticles.ToList(),
                };

                await _articleService.UploadArticleFromDataSourceAsync(request);

                await Task.Delay(1000, stoppingToken);
            }
            //_logger.LogInformation($"=====END SOURCING FOR {dataSource.DataSource}=====");
        }
    }
}
