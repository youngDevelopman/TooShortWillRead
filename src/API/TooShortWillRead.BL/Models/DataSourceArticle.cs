using System;
using System.Collections.Generic;
using TooShortWillRead.BL.Enums;

namespace TooShortWillRead.BL.Models
{
    public class DataSourceArticle
    {
        public string Header { get; set; }

        public string Text { get; set; }

        public string ImageName { get; set; }

        public Uri ImageUrl { get; set; }

        public DataSourceEnum DataSource { get; set; }

        public string InternalId { get; set; }

        public IEnumerable<string> Categories { get; set; }
    }
}
