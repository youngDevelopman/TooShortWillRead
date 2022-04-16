using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;

namespace TooShortWillRead.BL.Services.DataSources
{
    public class BritannicaDataSource : IDataSource
    {
        private readonly HttpClient _httpClient;
        private readonly IBrowsingContext _browsingContext;
        private readonly ILogger<BritannicaDataSource> _logger;
        private int _currentPage;
        private int _pageSize;
        public BritannicaDataSource(
            HttpClient httpClient, 
            IBrowsingContext browsingContext,
            ILogger<BritannicaDataSource> logger)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://www.britannica.com");

            _browsingContext = browsingContext;
            _logger = logger;

            _pageSize = 10;
        }

        public async Task<List<DataSourceArticle>> GenerateRandomArticles()
        {
            var randomArticles = await GenerateListOfRandomArticles();

            var result = new List<DataSourceArticle>();
            foreach (var anchor in randomArticles)
            {
                string articleRelativePath = anchor.PathName;

                var article = await GetArticle(articleRelativePath);

                if(article != null)
                {
                    result.Add(article);
                }

            }
            _currentPage++;
            return result;
        }

        public async Task<DataSourceArticle> GetArticle(string url)
        {
            var articleResponse = await _httpClient.GetAsync(url);
            var content = await articleResponse.Content.ReadAsStringAsync();

            var document = await _browsingContext.OpenAsync(req => req.Content(content));
            if (!IsSummaryArticle(document))
            {
                return null;
            }

            string imageUrl = await GetArticleImageUrl(document);

            if(imageUrl == null)
            {
                _logger.LogWarning($"No images found for {url} url. This article will be skipped.");
                return null;
            }

            string articleId = GetArticleId(document);
            string summary = GetArticleSummary(document);
            string header = GetArticleHeader(document);

            var article = new DataSourceArticle()
            {
                DataSourceId = 3,
                Header = header,
                ImageName = Path.GetFileName(imageUrl),
                ImageUrl = new Uri(imageUrl),
                InternalId = articleId,
                Text = summary,
            };

            return article;
        }

        private async Task<List<IHtmlAnchorElement>> GenerateListOfRandomArticles()
        {
            var randomArticlesResponse = await _httpClient.GetAsync($"ajax/summary/browse?p={_currentPage}&n={_pageSize}");
            var content = await randomArticlesResponse.Content.ReadAsStringAsync();

            var document = await _browsingContext.OpenAsync(req => req.Content(content));
            var anchors = document.All
                .Where(m => m.LocalName == "a" && m.ClassList.Contains("card-media"))
                .Select(a => a as IHtmlAnchorElement);

            return anchors.ToList();
        }

        private bool IsSummaryArticle(IDocument htmlDocument)
        {
            var headerElement = htmlDocument.All
                .Where(m => m.LocalName == "h1")
                .FirstOrDefault();
            string header = headerElement.TextContent;
            string summary = header.Trim().Split(' ').Last();

            return summary == "summary" ? true : false;
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

        private async Task<string> GetArticleImageUrl(IDocument htmlDocument)
        {
            var imagesAnchorElement = (IHtmlAnchorElement)htmlDocument.All
                   .Where(m => m.LocalName == "a" && m.Text() == "Images")
                   .FirstOrDefault();
            if(imagesAnchorElement == null)
            {
                return null;
            }

            var absoluteImagePath = new Uri(imagesAnchorElement.Href).AbsolutePath;
            var imagesRef = new Uri(new Uri("https://www.britannica.com"), absoluteImagePath);

            var response = await _httpClient.GetAsync(imagesRef);
            var content = await response.Content.ReadAsStringAsync();
            var document = await _browsingContext.OpenAsync(req => req.Content(content));

            var imageElement = (IHtmlImageElement)document
                .QuerySelectorAll("div#Images img")
                .FirstOrDefault();

            var imageUrl = new Uri(imageElement.Source).GetLeftPart(UriPartial.Path);

            return imageUrl;
        }
    }
}
