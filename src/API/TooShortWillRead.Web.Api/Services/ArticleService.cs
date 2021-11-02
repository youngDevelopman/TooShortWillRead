using System;
using System.Linq;
using TooShortWillRead.DAL;
using TooShortWillRead.Web.Api.Models.Response;

namespace TooShortWillRead.Web.Api.Services
{
    public class ArticleService : IArticleService
    {
        private readonly ApplicationDbContext _context;
        private readonly Uri _blobStorageBaseUrl = new Uri("https://tswr.blob.core.windows.net/articles-images/");
        public ArticleService(ApplicationDbContext context)
        {
            _context = context;
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
    }
}
