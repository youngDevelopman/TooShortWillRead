using System;
using System.Threading.Tasks;
using TooShortWillRead.BL.Models.Request;
using TooShortWillRead.BL.Models.Response;

namespace TooShortWillRead.BL.Interfaces
{
    public interface IArticleService
    {
        Task UploadArticleFromDataSourceAsync(UploadArticleFromDataSourceRequest request);

        Task UploadArticleLocallyAsync(UploadArticleLocallyRequest request);

        Task UploadArticleFromUrlAsync(UploadArticleFromUrlRequest request);

        GetRandomArticleResponse GetRandomArticle();

        GetRandomArticleIdResponse GetRandomArticleId();

        GetArticleResponse GetArticle(Guid id);

        GetArticleCountResponse GetArticleCount();
    }
}
