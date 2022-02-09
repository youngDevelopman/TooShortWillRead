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

namespace TooShortWillRead.Crawler.DataSources.Wikipedia
{
    public class BritannicaDataSource : IDataSource
    {
        private readonly HttpClient _httpClient;
        private readonly IBrowsingContext _browsingContext;
        private readonly ILogger<BritannicaDataSource> _logger;
        private int _currentPage;
        private int _pageSize;

        public BritannicaDataSource(HttpClient httpClient, IBrowsingContext browsingContext, ILogger<BritannicaDataSource> logger)
        {
            _httpClient = httpClient;

            _httpClient.BaseAddress = new Uri("https://www.britannica.com");

            _browsingContext = browsingContext;
            _logger = logger;

            _currentPage = 31;
            _pageSize = 10;
        }

        public DataSourceEnum DataSource => DataSourceEnum.Britannica;

        public async Task<List<DataSourceArticle>> GenerateRandomArticles()
        {
            var randomArticles = await GenerateListOfRandomArticles();

            var result = new List<DataSourceArticle>();
            foreach (var anchor in randomArticles)
            {
                string articleRelativePath = anchor.PathName;

                string imageUrl = GetArticleImageUrl(anchor);
                var imageName = Path.GetFileName(imageUrl);

                if(imageName == "default3.png")
                {
                    _logger.LogWarning($"{articleRelativePath} does not have an image.");
                    continue;
                }

                IDocument article = await GetArticle(articleRelativePath);

                if(article == null)
                {
                    _logger.LogWarning($"{articleRelativePath} is not an article");
                    continue;
                }

                string articleId = GetArticleId(article);
                string summary = GetArticleSummary(article);
                string header = GetArticleHeader(article);

                var articleToAdd = new DataSourceArticle()
                {
                    Header = header,
                    Text = summary,
                    ImageUrl = imageUrl,
                    InternalId = articleId,
                };

                result.Add(articleToAdd);

            }
            _currentPage++;
            return result;
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

        private async Task<IDocument> GetArticle(string relativePath)
        {
            var articleResponse = await _httpClient.GetAsync(relativePath);
            var articleContent = await articleResponse.Content.ReadAsStringAsync();
            var articleDocument = await _browsingContext.OpenAsync(req => req.Content(articleContent));

            if (!IsSummaryArticle(articleDocument))
            {
                return null;
            }

            return articleDocument;
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

        private string GetArticleImageUrl(IHtmlAnchorElement htmlAnchorElement)
        {
            var imageElement = htmlAnchorElement.Children
                .Where(m => m.LocalName == "img")
                .FirstOrDefault() as IHtmlImageElement;
            var imageOriginalUri = new Uri(imageElement.Source);

            var imagePath = imageOriginalUri.Segments.Skip(2).Aggregate((current, next) => string.Concat(current, next));
            var imageUri = new Uri(new Uri(imageOriginalUri.GetLeftPart(System.UriPartial.Authority)), imagePath);

            return imageUri.ToString();
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
    }
}
