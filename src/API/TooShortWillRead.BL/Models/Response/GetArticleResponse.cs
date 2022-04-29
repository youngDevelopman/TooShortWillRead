using System;
using System.Collections.Generic;

namespace TooShortWillRead.BL.Models.Response
{
    public class GetArticleResponse
    {
        public Guid Id { get; set; }
        
        public string Header { get; set; }

        public string Text { get; set; }

        public Uri ImageLink { get; set; }

        public IEnumerable<string> Categories { get; internal set; }
    }
}
