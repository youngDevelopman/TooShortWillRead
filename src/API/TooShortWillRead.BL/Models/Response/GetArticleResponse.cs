using System;

namespace TooShortWillRead.BL.Models.Response
{
    public class GetArticleResponse
    {
        public Guid Id { get; set; }
        
        public string Header { get; set; }

        public string Text { get; set; }

        public Uri ImageLink { get; set; }
    }
}
