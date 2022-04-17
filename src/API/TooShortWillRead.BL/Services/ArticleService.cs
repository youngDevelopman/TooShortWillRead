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
    }
}
