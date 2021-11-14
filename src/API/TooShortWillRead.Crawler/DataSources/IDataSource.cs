using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.Crawler.DataSources
{
    public interface IDataSource
    {
        public string DataSourceName { get; }

        Task<List<DataSourceArticle>> GenerateRandomArticles();
    }
}
