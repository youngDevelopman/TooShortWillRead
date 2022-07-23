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
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TooShortWillRead.BL.Enums;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.BL.Services.DataSources
{
    public class BritannicaDataSource : IDataSource
    {
        private readonly HttpClient _httpClient;
        private readonly IBrowsingContext _browsingContext;
        private readonly ILogger<BritannicaDataSource> _logger;

        public DataSourceEnum DataSource => DataSourceEnum.Britannica;

        public BritannicaDataSource(
            HttpClient httpClient, 
            IBrowsingContext browsingContext,
            ILogger<BritannicaDataSource> logger)
        {
            _httpClient = httpClient;
            _browsingContext = browsingContext;
            _logger = logger;
        }

        public async Task<DataSourceArticle> GetArticleAsync(string url)
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
            var categories = GetCategories(document);

            var article = new DataSourceArticle()
            {
                DataSource = this.DataSource,
                Header = header,
                ImageName = Path.GetFileName(imageUrl),
                ImageUrl = new Uri(imageUrl),
                InternalId = articleId,
                Text = summary,
                Categories = categories,
                OriginalUrl = new Uri(url),
            };

            return article;
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
            summary = UppercaseFirst(summary);

            return summary;
        }

        private string GetArticleHeader(IDocument htmlDocument)
        {
            var headerElement = htmlDocument.All
                    .Where(m => m.LocalName == "h1")
                    .FirstOrDefault();
            string header = headerElement.TextContent;
            header = header.Replace("summary", "").Trim();
            header = UppercaseFirst(header);

            return header;
        }

        private async Task<string> GetArticleImageUrl(IDocument htmlDocument)
        {
            var imagesAnchorElement = (IHtmlAnchorElement)htmlDocument.All
                   .Where(m => m.LocalName == "a" && m.Text().Trim() == "Images")
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

        private IEnumerable<string> GetCategories(IDocument document)
        {
            string pattern = @"\t|\n|\r";
            var categories = document
                .QuerySelectorAll("nav.breadcrumb > span:not(:first-child):not(:last-child)")
                .Select(s => s.TextContent)
                .Select(c => Regex.Replace(c, pattern, string.Empty));
            return categories;
        }

        private string UppercaseFirst(string str)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(str))
            {
                return string.Empty;
            }
            // Return char and concat substring.
            return char.ToUpper(str[0]) + str.Substring(1);
        }
    }
}
