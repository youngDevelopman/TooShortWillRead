using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Reflection.Metadata;
using System.Text.Json;
using System.Threading.Tasks;
using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;
using TooShortWillRead.Crawler.Config;

namespace TooShortWillRead.Crawler.ArticlesGenerators
{
    public class HistoryComArticlesGenerator : IArticlesGenerator
    {
        private readonly HttpClient _httpClient;
        private readonly IBrowsingContext _browsingContext;
        private readonly IDataSource _dataSource;
        private readonly HistoryComGeneratorConfig _config;
        private readonly ILogger<HistoryComArticlesGenerator> _logger;
        public HistoryComArticlesGenerator(
            IBrowsingContext browsingContext,
            IDataSource dataSource,
            HttpClient httpClient,
            IOptions<HistoryComGeneratorConfig> config,
            ILogger<HistoryComArticlesGenerator> logger)
        {
            _httpClient = httpClient;
            _browsingContext = browsingContext;
            _dataSource = dataSource;
            _config = config.Value;
            _logger = logger;
        }

        public async Task<IEnumerable<DataSourceArticle>> GenerateArticlesAsync()
        {
            var gridElements = new List<IHtmlDivElement>();
            await LoadMoreArticlesRecursively2("/topics", gridElements);

            var relativeUrls = gridElements
                .Select(x => x.FirstElementChild.GetAttribute("href"));

            var topicsWithDirectLink = new List<string>();
            var topicsWithMultipleSubtopics = new List<string>();

            foreach (var url in relativeUrls)
            {
                var urlSubresourcesNumber = url.Split('/').Length;
                if (urlSubresourcesNumber > 3)
                {
                    topicsWithDirectLink.Add(url);
                }
                else
                {
                    topicsWithMultipleSubtopics.Add(url);
                }
            }

            var subtopicsRelativeUrls = new List<string>();
            foreach (var topicUrl in topicsWithMultipleSubtopics)
            {
                var subtopicsElements = new List<IHtmlDivElement>();
                await LoadMoreArticlesRecursively2(topicUrl, subtopicsElements);

                subtopicsRelativeUrls.AddRange(subtopicsElements.Select(x => x.FirstElementChild.GetAttribute("href")));
            }

            topicsWithDirectLink.AddRange(subtopicsRelativeUrls);
            var urls = topicsWithDirectLink.Distinct();

            var result = new List<DataSourceArticle>();
            foreach (var url in urls)
            {
                try
                {
                    var article = await _dataSource.GetArticleAsync(url);
                    result.Add(article);
                }
                catch(Exception ex)
                {
                    _logger.LogWarning("Unable to add an article");
                    _logger.LogWarning($"Exception: {ex.Message}");
                }
            }

            return result;
        }

        private IEnumerable<IHtmlDivElement> GetGridItems(IDocument document)
        {
            var elements = document.All
                .Where(m => m.LocalName == "div" && m.ClassList.Contains("l-grid--item") && m.ClassList.Length == 1)
                .Cast<IHtmlDivElement>();

            return elements;
        }

        private IEnumerable<(string resultsToken, string initialSlots)> GetMoreResultsTokens(IHtmlDocument document)
        {
            var resultTokens = document.All
               .Where(x => x.HasAttribute("more-results-token") && x.HasAttribute("initial-slots"))
               .Select(x => ( resultsToken: x.GetAttribute("more-results-token"), initialSlots: x.GetAttribute("more-results-token") ));

            return resultTokens;
        }

        private async Task LoadMoreArticlesRecursively2(string relativeUrl, List<IHtmlDivElement> elements)
        {
            var response = await _httpClient.GetAsync(relativeUrl);
            var content = await response.Content.ReadAsStringAsync();

            if (relativeUrl.StartsWith("/.api/stream-html"))
            {
                var json = JsonDocument.Parse(content).RootElement;
                var html = json.GetProperty("html").GetString();
                content = html;
            }

            var document = await _browsingContext.OpenAsync(req => req.Content(content));
            var gridElements = GetGridItems(document).ToList();
            elements.AddRange(gridElements);

            var resultTokens = document.All
                .Where(x => x.HasAttribute("more-results-token") && x.HasAttribute("initial-slots"))
                .Select(x => new { resultsToken = x.GetAttribute("more-results-token"), initialSlots = x.GetAttribute("more-results-token") });

            if (resultTokens.Count() == 0)
            {
                return;
            }

            foreach (var token in resultTokens)
            {
                var relativeLoadUri = GetRelativeUriToLoadMoreArticles(token.resultsToken, token.initialSlots);
                await LoadMoreArticlesRecursively2(relativeLoadUri, elements);
            }
        }

        private string GetRelativeUriToLoadMoreArticles(string resultToken, string initialSlots)
        {
            return $"/.api/stream-html/topics?moreResultsToken={resultToken}&initialSlots={initialSlots}";
        }
    }
}

