using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models.Request;
using TooShortWillRead.BL.Models.Response;


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

        [HttpPost]
        public async Task<IActionResult> Upload([FromForm] UploadArticleRequest request)
        {
            await _articleService.UploadArticleAsync(request);
            return Ok();
        }

        [HttpPost("from-url")]
        public async Task<IActionResult> Upload([FromBody]UploadArticleFromUrlRequest request)
        {
            await _articleService.UploadArticleFromUrlAsync(request);
            return Ok();
        }


        [HttpGet("{id}")]
        public ActionResult<GetArticleResponse> Get(Guid id)
        {
            var article = _articleService.GetArticle(id);
            return Ok(article);
        }

        [HttpGet("count")]
        public ActionResult<GetArticleCountResponse> GetArticleCount()
        {
            var article = _articleService.GetArticleCount();
            return Ok(article);
        }

        [HttpGet("random")]
        public ActionResult<GetRandomArticleResponse> GetRandomArticle()
        {
            var article = _articleService.GetRandomArticle();
            return Ok(article);
        }

        [HttpGet("random/id")]
        public ActionResult<GetRandomArticleResponse> GetRandomArticleId()
        {
            var articleId = _articleService.GetRandomArticleId();
            return Ok(articleId);
        }
    }
}
