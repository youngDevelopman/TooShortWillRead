using System;

namespace TooShortWillRead.Web.Api.Models.Response
{
    public class GetRandomArticleResponse
    {
        public string Header { get; set; }

        public string Text { get; set; }

        public Uri ImageLink { get; set; }
    }
}
