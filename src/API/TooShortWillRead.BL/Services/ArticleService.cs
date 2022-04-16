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
        private readonly IBrowsingContext _browsingContext;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ApplicationDbContext _context;
        private readonly IPictureStorage _pictureStorage;
        private readonly Uri _blobStorageBaseUrl;
        public ArticleService(
            IBrowsingContext browsingContext,
            IHttpClientFactory httpClientFactory,
            ApplicationDbContext context, 
            IPictureStorage pictureStorage, 
            IOptions<ArticlePictures> configuration)
        {
            _browsingContext = browsingContext;
            _httpClientFactory = httpClientFactory;
            _context = context;
            _pictureStorage = pictureStorage;
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
            var httpClient = _httpClientFactory.CreateClient();
            var uri = new Uri(request.Url);

            if (uri.Host == "en.wikipedia.org")
            {
                await UploadArticleFromWikipedia(httpClient, uri);
            }
            else if(uri.Host == "www.britannica.com")
            {
                await UploadArticleFromBritannica(httpClient, uri);
            }
        }

        // Britannica
        private async Task UploadArticleFromBritannica(HttpClient httpClient, Uri uri)
        {
            var articleResponse = await httpClient.GetAsync(uri.ToString());
            var content = await articleResponse.Content.ReadAsStringAsync();

            var document = await _browsingContext.OpenAsync(req => req.Content(content));
            var anchors = document.All;

            string articleId = GetArticleId(document);
            string summary = GetArticleSummary(document);
            string header = GetArticleHeader(document);
            string imageUrl = await GetArticleImageUrl(httpClient, document);

            await _pictureStorage.UploadAsync(new Uri(imageUrl));

            var article = new Article()
            {
                Header = header,
                ImageName = Path.GetFileName(imageUrl),
                Text = summary,
                DataSourceId = 3,
                InternalId = articleId,
            };
            await _context.Articles.AddAsync(article);
            await _context.SaveChangesAsync();
        }

        private string GetArticleId(IDocument htmlDocument)
        {
            var divWithId = htmlDocument.All
                    .Where(m => m.LocalName == "div" && m.HasAttribute("data-topic-id"))
                    .FirstOrDefault() as IHtmlDivElement;
            var articleId = divWithId?.Dataset["topic-id"];

            return articleId;
        }

        private string GetArticleSummary(IDocument htmlDocument)
        {
            var topicParagraph = htmlDocument.All
                    .Where(m => m.LocalName == "p" && m.ClassList.Contains("topic-paragraph"))
                    .FirstOrDefault();
            var summary = topicParagraph?.TextContent;

            return summary;
        }

        private string GetArticleHeader(IDocument htmlDocument)
        {
            var headerElement = htmlDocument.All
                    .Where(m => m.LocalName == "h1")
                    .FirstOrDefault();
            string header = headerElement.TextContent;
            header = header.Replace("summary", "").Trim();

            return header;
        }

        private async Task<string> GetArticleImageUrl(HttpClient httpClient, IDocument htmlDocument)
        {
            var imagesAnchorElement = (IHtmlAnchorElement)htmlDocument.All
                   .Where(m => m.LocalName == "a" && m.Text() == "Images")
                   .FirstOrDefault();
            var absoluteImagePath = new Uri(imagesAnchorElement.Href).AbsolutePath;
            var imagesRef = new Uri(new Uri("https://www.britannica.com"), absoluteImagePath);

            var response = await httpClient.GetAsync(imagesRef);
            var content = await response.Content.ReadAsStringAsync();
            var document = await _browsingContext.OpenAsync(req => req.Content(content));

            var imageElement = (IHtmlImageElement)document
                .QuerySelectorAll("div#Images img")
                .FirstOrDefault();

            var imageUrl = new Uri(imageElement.Source).GetLeftPart(UriPartial.Path);

            return imageUrl;
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
