using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace TooShortWillRead.Crawler.DataSources.Wikipedia
{
    public class WikipediaDataSource : IDataSource
    {
        private readonly HttpClient _httpClient;
        public WikipediaDataSource(HttpClient httpClient)
        {
            _httpClient = httpClient;

            _httpClient.BaseAddress = new Uri("https://en.wikipedia.org");
        }

        public DataSourceEnum DataSource => DataSourceEnum.Wikipedia;

        public async Task<List<DataSourceArticle>> GenerateRandomArticles()
        {
            var randomArticles = await GenerateListOfRandomArticles();
            
            await FillImageUrls(randomArticles);
            randomArticles = randomArticles
                .Where(artcile => artcile.ImageUrl != null)
                .ToList();

            await FillSummaries(randomArticles);

            return randomArticles;
        }

        private async Task<List<DataSourceArticle>> GenerateListOfRandomArticles()
        {
            var randomArticlesResponse = await _httpClient.GetAsync("w/api.php?action=query&list=random&rnnamespace=0&rnlimit=10&format=json");
            var content = await randomArticlesResponse.Content.ReadAsStringAsync();
            
            var json = JsonDocument.Parse(content).RootElement;
            var randomArticlesJsonList = json.GetProperty("query").GetProperty("random");

            var randomArticles = randomArticlesJsonList.EnumerateArray().Select(article =>
            {
                var pageId = article.GetProperty("id").GetInt32();
                var title = article.GetProperty("title").GetString();
                return new DataSourceArticle()
                {
                    InternalId = pageId.ToString(),
                    Header = title
                };
            });

            return randomArticles.ToList();
        }

        private async Task FillImageUrls(List<DataSourceArticle> articles)
        {
            string pageIdsUrlFormat = articles
                 .Select(article => article.InternalId)
                 .Aggregate((current, next) => string.Concat(current, '|', next));

            var response = await _httpClient.GetAsync($"/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids={pageIdsUrlFormat}");
            var responseString = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(responseString).RootElement;

            var pages = json.GetProperty("query").GetProperty("pages");

            foreach (var article in articles)
            {
                var pageJson = pages.GetProperty(article.InternalId.ToString());
                if (pageJson.TryGetProperty("original", out JsonElement original)) 
                {
                    var imageUrl = original.GetProperty("source").GetString();
                    article.ImageUrl = imageUrl;
                }
            }
        }

        private async Task FillSummaries(List<DataSourceArticle> articles)
        {
            string pageIdsUrlFormat = articles
                 .Select(article => article.InternalId)
                 .Aggregate((current, next) => string.Concat(current, '|', next));

            var response = await _httpClient.GetAsync($"/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&pageids={pageIdsUrlFormat}&redirects=");
            var responseString = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(responseString).RootElement;

            var pages = json.GetProperty("query").GetProperty("pages");
            foreach (var article in articles)
            {
                var pageJson = pages.GetProperty(article.InternalId.ToString());
                var summary = pageJson.GetProperty("extract").GetString();
                article.Text = summary;
            }
        }
    }
}
