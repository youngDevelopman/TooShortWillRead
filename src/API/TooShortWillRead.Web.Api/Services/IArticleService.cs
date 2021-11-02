using TooShortWillRead.Web.Api.Models.Response;

namespace TooShortWillRead.Web.Api.Services
{
    public interface IArticleService
    {
        GetRandomArticleResponse GetRandomArticle();
    }
}
