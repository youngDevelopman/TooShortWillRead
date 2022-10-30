using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using Microsoft.Extensions.Logging;
using TooShortWillRead.BL.Enums;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;

namespace TooShortWillRead.BL.Services.DataSources
{
    public class HistoryComDataSource : IDataSource
    {
        private readonly HttpClient _httpClient;
        private readonly IBrowsingContext _browsingContext;
        private readonly ILogger<HistoryComDataSource> _logger;

        public HistoryComDataSource(
            HttpClient httpClient,
            IBrowsingContext browsingContext,
            ILogger<HistoryComDataSource> logger)
        {
            _httpClient = httpClient;
            _browsingContext = browsingContext;
            _logger = logger;
        }

        public DataSourceEnum DataSource => DataSourceEnum.HistoryCom;

        public async Task<DataSourceArticle> GetArticleAsync(string url)
        {
            var articleResponse = await _httpClient.GetAsync(url);
            var content = await articleResponse.Content.ReadAsStringAsync();

            var document = await _browsingContext.OpenAsync(req => req.Content(content));


            var metaElements = document.All
                .Where(m => m.LocalName == "meta")
                .Cast<IHtmlMetaElement>();

            if (!IsTopicsSection(metaElements))
            {
                throw new Exception("HistoryCom: Not a topic section");
            }
            else if (!IsArticlePagetype(metaElements))
            {
                throw new Exception("HistoryCom: Not an article pagetype");
            }
            else if (IsTimeLine(document))
            {
                throw new Exception("HistoryCom: Timeline article types are not supported");
            }

            var articleId = GetArticleId(metaElements);
            var categories = GetCategories(metaElements).ToList();
            categories.Remove("Topics");

            var imageUrl = GetImageUrl(metaElements);
            var header = GetHeader(document);
            var summary = GetSummary(document);
            var originalUrl = GetOriginalUrl(document);

            var article = new DataSourceArticle()
            {
                DataSource = this.DataSource,
                Header = header,
                ImageName = Path.GetFileName(imageUrl.ToString()),
                ImageUrl = imageUrl,
                InternalId = articleId,
                Text = summary,
                Categories = categories,
                OriginalUrl = originalUrl,
            };
            return article;
        }

        private bool IsTimeLine(IDocument document)
        {
            var title = document.All
                .Where(m => m.LocalName == "title")
                .First() as IHtmlTitleElement;

            var titleStr = title.TextContent;

            return titleStr.Contains("Timeline", StringComparison.OrdinalIgnoreCase);
        }

        private bool IsTopicsSection(IEnumerable<IHtmlMetaElement> elements)
        {
            var section = elements
                .Where(m => m.Name == "section")
                .First()
                .Content;

            return section == "Topics" ? true : false;
        }

        private bool IsArticlePagetype(IEnumerable<IHtmlMetaElement> elements)
        {
            var section = elements
                .Where(m => m.Name == "pagetype")
                .First()
                .Content;

            return section == "article" ? true : false;
        }

        private string GetArticleId(IEnumerable<IHtmlMetaElement> elements)
        {
            var articleId = elements
                .Where(m => m.Name == "item-id")
                .First()
                .Content;

            return articleId;
        }

        private IEnumerable<string> GetCategories(IEnumerable<IHtmlMetaElement> elements)
        {
            var categoriesString = elements
                .Where(m => m.Name == "keywords")
                .First()
                .Content;

            var categories = categoriesString.Split(',');
            return categories;
        }

        private Uri GetImageUrl(IEnumerable<IHtmlMetaElement> elements)
        {
            var image = elements
              .Where(m => m.Name == "twitter:image")
              .First()
              .Content;

            var imageUrl = new Uri(image);
            return imageUrl;
        }

        private string GetHeader(IDocument document)
        {
            var headerElement = document.All
              .Where(m => m.LocalName == "h1")
              .First() as IHtmlHeadingElement;

            return headerElement.TextContent;
        }

        private string GetSummary(IDocument document)
        {
            var divElement = document.All
                .Where(x => x.LocalName == "div" && x.ClassList.Contains("m-detail--body"))
                .First() as IHtmlDivElement;

            var firstParagraphElement = divElement.Children
                .Where(x => x.LocalName == "p")
                .First() as IHtmlParagraphElement;

            return firstParagraphElement.TextContent;
        }

        private Uri GetOriginalUrl(IDocument document)
        {
            var originalUrlElement = document.All
               .Where(m => m.LocalName == "link")
               .First() as IHtmlLinkElement;

            var originalLink = new Uri(originalUrlElement.Href);
            return originalLink;
        }
    }
}

