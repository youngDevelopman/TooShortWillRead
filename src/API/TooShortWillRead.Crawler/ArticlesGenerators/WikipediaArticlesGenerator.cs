using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;
using TooShortWillRead.Crawler.Config;

namespace TooShortWillRead.Crawler.ArticlesGenerators
{
    public class WikipediaArticlesGenerator : IArticlesGenerator
    {
        private readonly HttpClient _httpClient;
        private readonly IDataSource _dataSource;
        private readonly WikipediaGeneratorConfig _config;
        public WikipediaArticlesGenerator(
            HttpClient httpClient,
            IDataSource dataSource,
            IOptions<WikipediaGeneratorConfig> config)
        {
            _httpClient = httpClient;
            _dataSource = dataSource;
            _config = config.Value;
        }

        public async Task<IEnumerable<DataSourceArticle>> GenerateArticlesAsync()
        {
            var randomArticles = await GenerateListOfRandomArticles();
            var articles = new List<DataSourceArticle>();
            foreach (var articleId in randomArticles)
            {
                var url = GetUrlFromPageId(articleId);
                var articleToAdd = await _dataSource.GetArticleAsync(url);
                if (articleToAdd == null)
                {
                    continue;
                }
                articles.Add(articleToAdd);
            }

            return articles;
        }

        private string GetUrlFromPageId(int pageId)
        {
            var url = new Uri(_httpClient.BaseAddress, $"?curid={pageId}");
            return url.ToString();
        }

        private async Task<List<int>> GenerateListOfRandomArticles()
        {
            var randomArticlesResponse = await _httpClient.GetAsync($"w/api.php?action=query&list=random&rnnamespace=0&rnlimit={_config.PageSize}&format=json");
            var content = await randomArticlesResponse.Content.ReadAsStringAsync();

            var json = JsonDocument.Parse(content).RootElement;
            var randomArticlesJsonList = json.GetProperty("query").GetProperty("random");

            var randomArticles = randomArticlesJsonList.EnumerateArray().Select(article =>
            {
                var pageId = article.GetProperty("id").GetInt32();
                return pageId;
            });

            return randomArticles.ToList();
        }
    }
}

