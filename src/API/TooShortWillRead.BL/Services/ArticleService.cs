using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using TooShortWillRead.BL.Configuration;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models.Request;
using TooShortWillRead.BL.Models.Response;
using TooShortWillRead.DAL;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.Web.Api.Services
{
    public class ArticleService : IArticleService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPictureStorage _pictureStorage;
        private readonly IDataSourceFactory _dataSourceFactory;
        private readonly Uri _blobStorageBaseUrl;
        public ArticleService(
            ApplicationDbContext context, 
            IPictureStorage pictureStorage,
            IDataSourceFactory dataSourceFactory,
            IOptions<ArticlePictures> configuration)
        {;
            _context = context;
            _pictureStorage = pictureStorage;
            _dataSourceFactory= dataSourceFactory;
            _blobStorageBaseUrl = new Uri($"{configuration.Value.BaseUrl}/{configuration.Value.ContainerName}/");
        }

        public GetArticleCountResponse GetArticleCount()
        {
            var count = _context.Articles.Count();
            return new GetArticleCountResponse() { Count = count };
        }

        public GetRandomArticleIdResponse GetRandomArticleId()
        {
            var randomArticleId = _context.Articles
                .OrderBy(r => Guid.NewGuid())
                .Select(r => r.Id)
                .First();
            return new GetRandomArticleIdResponse() { Id = randomArticleId };
        }

        public GetRandomArticleResponse GetRandomArticle()
        {
            var randomArticle = _context.Articles.OrderBy(r => Guid.NewGuid()).First();
            return new GetRandomArticleResponse()
            {
                Header = randomArticle.Header,
                Text = randomArticle.Text,
                ImageLink = new Uri(_blobStorageBaseUrl, randomArticle.ImageName),
            };
        }

        public GetArticleResponse GetArticle(Guid id)
        {
            var article = _context.Articles.FirstOrDefault(a => a.Id == id);
            return new GetArticleResponse()
            {
                Id = id,
                Header = article.Header,
                ImageLink = new Uri(_blobStorageBaseUrl, article.ImageName),
                Text = article.Text,
            };
        }

        public async Task UploadArticleAsync(UploadArticleRequest request)
        {
            using var memoryStream = new MemoryStream();
            await request.Image.CopyToAsync(memoryStream);
            memoryStream.Position = 0;
            string fileName = request.Image.FileName;
            if(request.ImageName != null)
            {
                string extension = Path.GetExtension(fileName);
                fileName = string.Concat(request.ImageName, extension);
            }

            await _pictureStorage.UploadAsync(fileName, memoryStream);

            var article = new Article()
            {
                Header = request.Header,
                ImageName = fileName,
                Text = request.Text,
                DataSourceId = 1,
            };

            await _context.Articles.AddAsync(article);
            await _context.SaveChangesAsync();
        }

        public async Task UploadArticleFromUrlAsync(UploadArticleFromUrlRequest request)
        {
            var articleUrl = new Uri(request.Url);
            IDataSource dataSource = _dataSourceFactory.ResolveDataSource(articleUrl);
            var article = await dataSource.GetArticle(articleUrl.ToString());
            
            await _pictureStorage.UploadAsync(article.ImageUrl);
            var articleToAdd = new Article()
            {
                Header = article.Header,
                ImageName = article.ImageName,
                Text = article.Text,
                DataSourceId = article.DataSourceId,
                InternalId = article.InternalId,
            };
            await _context.Articles.AddAsync(articleToAdd);
            await _context.SaveChangesAsync();
        }

        // Wikipedia

        private async Task UploadArticleFromWikipedia(HttpClient httpClient, Uri uri)
        {
            var titleFromUrl = uri.Segments.Last();

            var pageId = await GetWikipediaPageIdFromTitleAsync(httpClient, titleFromUrl);
            var imageUrl = await GetWikipediaPageImageAsync(httpClient, pageId);
            var (title, summary) = await GetWikipediaPageSummaryAndTitleAsync(httpClient, pageId);

            await _pictureStorage.UploadAsync(new Uri(imageUrl));

            var article = new Article()
            {
                Header = title,
                ImageName = Path.GetFileName(imageUrl),
                Text = summary,
                DataSourceId = 2,
                InternalId = pageId.ToString(),
            };
            await _context.Articles.AddAsync(article);
            await _context.SaveChangesAsync();
        }

        private async Task<int> GetWikipediaPageIdFromTitleAsync(HttpClient httpClient, string pageTitle)
        {
            var response = await httpClient.GetAsync($"https://en.wikipedia.org/w/api.php?action=query&prop=info&format=json&titles={pageTitle}");

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

        private async Task<string> GetWikipediaPageImageAsync(HttpClient httpClient, int pageId)
        {
            var response = await httpClient.GetAsync($"https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&pageids={pageId}");

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonDocument.Parse(content).RootElement;
            var imageUrl = json.GetProperty("query")
                .GetProperty("pages")
                .EnumerateObject()
                .First()
                .Value
                .GetProperty("original")
                .GetProperty("source")
                .GetString();

            return imageUrl;
        }

        private async Task<(string, string)> GetWikipediaPageSummaryAndTitleAsync(HttpClient httpClient, int pageId)
        {
            var response = await httpClient.GetAsync($"https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&pageids={pageId}&redirects=");

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
