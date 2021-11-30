using AngleSharp;
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

        public DataSourceEnum DataSource => DataSourceEnum.Wikipedia;

        public async Task<List<DataSourceArticle>> GenerateRandomArticles()
        {
            var randomArticlesResponse = await _httpClient.GetAsync($"ajax/summary/browse?p=0&n=10");
            var content = await randomArticlesResponse.Content.ReadAsStringAsync();

            var document = await _browsingContext.OpenAsync(req => req.Content(content));
            var anchors = document.All
                .Where(m => m.LocalName == "a" && m.ClassList.Contains("card-media"))
                .Select(a => a as IHtmlAnchorElement);

            var result = new List<DataSourceArticle>();
            foreach (var anchor in anchors)
            {
                string href = anchor.PathName;
                var articleResponse = await _httpClient.GetAsync(href);
                var articleContent = await articleResponse.Content.ReadAsStringAsync();
                var articleDocument = await _browsingContext.OpenAsync(req => req.Content(articleContent));
                var topicParagraph = articleDocument.All
                    .Where(m => m.LocalName == "p" && m.ClassList.Contains("topic-paragraph"))
                    .FirstOrDefault();
                var summary = topicParagraph.TextContent;
                
                var headerElement = articleDocument.All
                    .Where(m => m.LocalName == "h1")
                    .FirstOrDefault();
                string header = headerElement.TextContent;
                header = header.Replace("summary", "").Trim();
                
                var imageElement = anchor.Children
                    .Where(m => m.LocalName == "img")
                    .FirstOrDefault() as IHtmlImageElement;
                var imageOriginalUri = new Uri(imageElement.Source);

                var imagePath = imageOriginalUri.Segments.Skip(2).Aggregate((current, next) => string.Concat(current, next));
                var imageUri = new Uri(new Uri(imageOriginalUri.GetLeftPart(System.UriPartial.Authority)), imagePath);
                var articleToAdd = new DataSourceArticle()
                {
                    Header = header,
                    Text = summary,
                    ImageUrl = imageUri.ToString(),

                    // href is probably unique
                    InternalId = href,
                };

            }

            return null;
        }
    }
}
