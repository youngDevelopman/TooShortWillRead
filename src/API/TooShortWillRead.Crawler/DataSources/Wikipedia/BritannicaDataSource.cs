using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using System;
using System.Collections.Generic;
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
        public BritannicaDataSource(HttpClient httpClient, IBrowsingContext browsingContext)
        {
            _httpClient = httpClient;

            _httpClient.BaseAddress = new Uri("https://www.britannica.com");

            _browsingContext = browsingContext;
        }

        public DataSourceEnum DataSource => DataSourceEnum.Britannica;

        public async Task<List<DataSourceArticle>> GenerateRandomArticles()
        {
            var randomArticles = await GenerateListOfRandomArticles();

            var result = new List<DataSourceArticle>();
            foreach (var anchor in randomArticles)
            {
                string imageUrl = GetArticleImageUrl(anchor);

                string articleRelativePath = anchor.PathName;
                IDocument article = await GetArticle(articleRelativePath);

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
            return result;
        }

        private async Task<List<IHtmlAnchorElement>> GenerateListOfRandomArticles()
        {
            var randomArticlesResponse = await _httpClient.GetAsync($"ajax/summary/browse?p=0&n=10");
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

            return articleDocument;
        }

        private string GetArticleId(IDocument htmlDocument)
        {
            var divWithId = htmlDocument.All
                    .Where(m => m.LocalName == "div" && m.HasAttribute("data-topic-id"))
                    .FirstOrDefault() as IHtmlDivElement;
            var articleId = divWithId.Dataset["topic-id"];

            return articleId;
        }

        private string GetArticleSummary(IDocument htmlDocument)
        {
            var topicParagraph = htmlDocument.All
                    .Where(m => m.LocalName == "p" && m.ClassList.Contains("topic-paragraph"))
                    .FirstOrDefault();
            var summary = topicParagraph.TextContent;

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
    }
}
