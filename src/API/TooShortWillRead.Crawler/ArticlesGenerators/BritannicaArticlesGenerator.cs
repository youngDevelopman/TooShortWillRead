using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Html.Dom;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;
using TooShortWillRead.Crawler.Config;

namespace TooShortWillRead.Crawler.ArticlesGenerators
{
    public class BritannicaArticlesGenerator : IArticlesGenerator
    {
        private readonly HttpClient _httpClient;
        private readonly IBrowsingContext _browsingContext;
        private readonly IDataSource _dataSource;
        private readonly BritannicaGeneretorConfig _config;
        private readonly ILogger<BritannicaArticlesGenerator> _logger;
        private int _currentPage;

        public BritannicaArticlesGenerator(
            IBrowsingContext browsingContext,
            IDataSource dataSource,
            HttpClient httpClient,
            IOptions<BritannicaGeneretorConfig> configuration)
        {
            _httpClient = httpClient;
            _browsingContext = browsingContext;
            _dataSource = dataSource;
            var config = configuration.Value;
            _config = config;
            _currentPage = config.CurrentPage;

        }

        public async Task<IEnumerable<DataSourceArticle>> GenerateArticlesAsync()
        {
            var randomArticles = await GenerateListOfRandomArticles();

            var result = new List<DataSourceArticle>();
            foreach (var anchor in randomArticles)
            {
                string articleRelativePath = anchor.PathName;
                var articleUrl = new Uri(_httpClient.BaseAddress, articleRelativePath);
                var article = await _dataSource.GetArticleAsync(articleUrl.ToString());

                if (article != null)
                {
                    result.Add(article);
                }

            }
            _currentPage++;
            return result;
        }

        private async Task<List<IHtmlAnchorElement>> GenerateListOfRandomArticles()
        {
            var randomArticlesResponse = await _httpClient.GetAsync($"ajax/summary/browse?p={_currentPage}&n={_config.PageSize}");
            var content = await randomArticlesResponse.Content.ReadAsStringAsync();

            var document = await _browsingContext.OpenAsync(req => req.Content(content));
            var anchors = document.All
                .Where(m => m.LocalName == "a" && m.ClassList.Contains("card-media"))
                .Select(a => a as IHtmlAnchorElement);

            return anchors.ToList();
        }
    }
}

