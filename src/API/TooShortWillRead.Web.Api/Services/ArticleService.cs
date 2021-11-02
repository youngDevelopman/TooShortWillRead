using TooShortWillRead.Web.Api.Models.Response;

namespace TooShortWillRead.Web.Api.Services
{
    public class ArticleService : IArticleService
    {
        public GetRandomArticleResponse GetRandomArticle()
        {
            return new GetRandomArticleResponse()
            {
                Header = "test header 1",
                Text = "some text",
                ImageLink = new System.Uri("https://tswr.blob.core.windows.net/articles-images/Jan_Matejko,_Stańczyk.jpg"),
            };
        }
    }
}
