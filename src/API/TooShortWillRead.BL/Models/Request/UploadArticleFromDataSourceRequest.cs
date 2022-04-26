using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.BL.Enums;

namespace TooShortWillRead.BL.Models.Request
{
    public class UploadArticleFromDataSourceRequest
    {
        public List<DataSourceArticle> Articles { get; set; }
    }
}
