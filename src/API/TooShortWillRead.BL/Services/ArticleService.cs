﻿using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly Uri _blobStorageBaseUrl = new Uri("https://tswr.blob.core.windows.net/articles-images/");
        public ArticleService(ApplicationDbContext context, IPictureStorage pictureStorage)
        {
            _context = context;
            _pictureStorage = pictureStorage;
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
    }
}