using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;

namespace TooShortWillRead.BL.Services.DataSources
{
    public class WikipediaDataSource : IDataSource
    {
        private readonly HttpClient _httpClient;
        public WikipediaDataSource(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public  async Task<List<DataSourceArticle>> GenerateRandomArticles()
        {
            var randomArticles = await GenerateListOfRandomArticles();
            var articles = new List<DataSourceArticle>();
            foreach(var article in randomArticles)
            {
                var articleToAdd = await GetArticle(article);
                if(articleToAdd == null)
                {
                    continue;
                }
                articles.Add(articleToAdd);
            }

            return articles;
        }

        public async Task<DataSourceArticle> GetArticle(string url)
        {
            var titleFromUrl = new Uri(url).Segments.Last();

            var pageId = await GetWikipediaPageIdFromTitleAsync(titleFromUrl);
            var imageUrl = await GetWikipediaPageImageAsync(pageId);
            var (title, summary) = await GetWikipediaPageSummaryAndTitleAsync(pageId);

            var article = new DataSourceArticle()
            {
                DataSourceId = 2,
                Header = title,
                ImageName = Path.GetFileName(imageUrl),
                ImageUrl = new Uri(imageUrl),
                InternalId = pageId.ToString(),
                Text = summary,
            };

            return article;
        }

        private async Task<DataSourceArticle> GetArticle(int pageId)
        {
            var imageUrl = await GetWikipediaPageImageAsync(pageId);
            if(imageUrl == null)
            {
                return null;
            }

            var (title, summary) = await GetWikipediaPageSummaryAndTitleAsync(pageId);

            var article = new DataSourceArticle()
            {
                DataSourceId = 2,
                Header = title,
                ImageName = Path.GetFileName(imageUrl),
                ImageUrl = new Uri(imageUrl),
                InternalId = pageId.ToString(),
                Text = summary,
            };

            return article;
        }

        private async Task<List<int>> GenerateListOfRandomArticles()
        {
            var randomArticlesResponse = await _httpClient.GetAsync("w/api.php?action=query&list=random&rnnamespace=0&rnlimit=10&format=json");
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

        private async Task<int> GetWikipediaPageIdFromTitleAsync(string pageTitle)
        {
            var response = await _httpClient.GetAsync($"/w/api.php?action=query&prop=info&format=json&titles={pageTitle}");

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(content).RootElement;
            var pageId = json.GetProperty("query")
                .GetProperty("pages")
                .EnumerateObject()
                .First()
                .Value
                .GetProperty("pageid")
                .GetInt32();

            return pageId;
        }

        private async Task<string> GetWikipediaPageImageAsync(int pageId)
        {
            var response = await _httpClient.GetAsync($"/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids={pageId}");

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(content).RootElement;
            var imageObj = json.GetProperty("query")
                .GetProperty("pages")
                .EnumerateObject()
                .First()
                .Value;

            if (!imageObj.TryGetProperty("original", out JsonElement original))
            {
                return null;
            }
            
            var imageUrl = original.GetProperty("source").GetString();

            return imageUrl;
        }

        private async Task<(string, string)> GetWikipediaPageSummaryAndTitleAsync(int pageId)
        {
            var response = await _httpClient.GetAsync($"/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&pageids={pageId}&redirects=");

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(content).RootElement;
            var summaryObject = json.GetProperty("query")
                .GetProperty("pages")
                .EnumerateObject()
                .First()
                .Value;
            var title = summaryObject.GetProperty("title").GetString();
            var summary = summaryObject.GetProperty("extract").GetString();

            return (title, summary);
        }
    }
}
