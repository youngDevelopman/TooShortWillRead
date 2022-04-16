using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TooShortWillRead.BL.Models
{
    public class DataSourceArticle
    {
        public string Header { get; set; }

        public string Text { get; set; }

        public string ImageName { get; set; }

        public Uri ImageUrl { get; set; }

        public int DataSourceId { get; set; }

        public string InternalId { get; set; }
    }
}
