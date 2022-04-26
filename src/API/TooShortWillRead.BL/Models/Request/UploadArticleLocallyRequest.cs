using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace TooShortWillRead.BL.Models.Request
{
    public class UploadArticleLocallyRequest
    {
        [Required]
        public string Header { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        [FromForm]
        public IFormFile Image { get; set; }

        public string ImageName { get; set; }
    }
}
