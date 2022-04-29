using AngleSharp;
using AngleSharp.Dom;
using AngleSharp.Html.Dom;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using TooShortWillRead.BL.Configuration;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;
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
        private readonly ILogger<ArticleService> _logger;
        public ArticleService(
            ApplicationDbContext context, 
            IPictureStorage pictureStorage,
            IDataSourceFactory dataSourceFactory,
            IOptions<ArticlePictures> configuration,
            ILogger<ArticleService> logger)
        {
            _context = context;
            _pictureStorage = pictureStorage;
            _dataSourceFactory= dataSourceFactory;
            _blobStorageBaseUrl = new Uri($"{configuration.Value.BaseUrl}/{configuration.Value.ContainerName}/");
            _logger = logger;
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
            var randomArticle = _context.Articles
                .Include(a => a.Categories)
                .OrderBy(r => Guid.NewGuid()).First();

            return new GetRandomArticleResponse()
            {
                Id = randomArticle.Id,
                Header = randomArticle.Header,
                Text = randomArticle.Text,
                ImageLink = new Uri(_blobStorageBaseUrl, randomArticle.ImageName),
                Categories = randomArticle.Categories.Select(c => c.Name),
            };
        }

        public GetArticleResponse GetArticle(Guid id)
        {
            var article = _context.Articles
                .Include(a => a.Categories)
                .FirstOrDefault(a => a.Id == id);

            return new GetArticleResponse()
            {
                Id = id,
                Header = article.Header,
                ImageLink = new Uri(_blobStorageBaseUrl, article.ImageName),
                Text = article.Text,
                Categories = article.Categories.Select(c => c.Name).ToList(),
            };
        }

        public async Task UploadArticleLocallyAsync(UploadArticleLocallyRequest request)
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
            var article = await dataSource.GetArticleAsync(articleUrl.ToString());
            
            await _pictureStorage.UploadAsync(article.ImageUrl);
            var articleToAdd = new Article()
            {
                Header = article.Header,
                ImageName = article.ImageName,
                Text = article.Text,
                DataSourceId = ((int)article.DataSource),
                InternalId = article.InternalId,
                Categories = article.Categories
                    .Select(c => new Category() { Name = c })
                    .ToList(),
            };
            await _context.Articles.AddAsync(articleToAdd);
            await _context.SaveChangesAsync();
        }

        public async Task UploadArticleFromDataSourceAsync(UploadArticleFromDataSourceRequest request)
        {
            var articles = request.Articles;
            var articlesToUpdate = new List<DataSourceArticle>();
            var articlesToAdd = new List<DataSourceArticle>();
            foreach (var article in articles)
            {
                if (_context.Articles.Any(a => a.DataSourceId == (int)article.DataSource && a.InternalId == article.InternalId))
                {
                    articlesToUpdate.Add(article);
                }
                else
                {
                    articlesToAdd.Add(article);
                }
            }

            await AddArticles(articlesToAdd);
            await UpdateArticles(articlesToUpdate);
        }

        public async Task DeleteArticleAsync(Guid id)
        {
            var article = _context.Articles.First(a => a.Id == id);
            string imageName = article.ImageName;
            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            await _pictureStorage.Delete(imageName);
        }

        private async Task AddArticles(List<DataSourceArticle> articles)
        {
            // Add record to the database
            var mappedArticles = MapDataSourceArticlesToDbModel(articles);
            _logger.LogInformation($"Add {articles.Count()} articles to the database...");
            await _context.Articles.AddRangeAsync(mappedArticles);
            await _context.SaveChangesAsync();

            // Add images
            _logger.LogInformation($"Add images");
            var imageUrls = articles.Select(article => article.ImageUrl);
            await _pictureStorage.UploadAsync(imageUrls.ToList());

            _logger.LogInformation($"Articles have been added.");
        }

        private async Task UpdateArticles(List<DataSourceArticle> articles)
        {
            // Update record in the database
            var articlesInDb = articles.Select(a =>
                _context.Articles.First(
                    dbArticle => dbArticle.DataSourceId == (int)a.DataSource && dbArticle.InternalId == a.InternalId));

            var updatedArticles = articlesInDb.Select(a =>
            {
                var articleToUpdateFrom = articles.First(ar => ar.InternalId == a.InternalId);
                a.Header = articleToUpdateFrom.Header;
                a.ImageName = articleToUpdateFrom.ImageName;
                a.Text = articleToUpdateFrom.Text;

                return a;
            });

            _logger.LogInformation($"Update {articles.Count()} articles in the database...");
            _context.Articles.UpdateRange(updatedArticles);
            await _context.SaveChangesAsync();

            // Update images
            _logger.LogInformation($"Update images");
            var imageUrls = articles.Select(article => article.ImageUrl);
            await _pictureStorage.UploadAsync(imageUrls.ToList());

            _logger.LogInformation($"Articles have been updated.");
        }

        private List<Article> MapDataSourceArticlesToDbModel(List<DataSourceArticle> articles)
        {
            var mapped = articles.Select(article =>
                new Article()
                {
                    DataSourceId = ((int)article.DataSource),
                    InternalId = article.InternalId,
                    Header = article.Header,
                    Text = article.Text,
                    ImageName = article.ImageName,
                });

            return mapped.ToList();
        }
    }
}
