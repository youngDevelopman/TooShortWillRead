using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace TooShortWillRead.BL.Models.Request
{
    public class UploadArticleFromUrlRequest
    {
        [Required]
        public string Url { get; set; }

    }
}
