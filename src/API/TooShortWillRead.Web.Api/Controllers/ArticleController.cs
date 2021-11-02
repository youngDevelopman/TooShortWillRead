using Microsoft.AspNetCore.Mvc;
using TooShortWillRead.Web.Api.Models.Response;
using TooShortWillRead.Web.Api.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TooShortWillRead.Web.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;
        public ArticleController(IArticleService articleService)
        {
            _articleService = articleService;
        }

        [HttpGet("random")]
        public ActionResult<GetRandomArticleResponse> Get()
        {
            var article = _articleService.GetRandomArticle();
            return Ok(article);
        }
    }
}
