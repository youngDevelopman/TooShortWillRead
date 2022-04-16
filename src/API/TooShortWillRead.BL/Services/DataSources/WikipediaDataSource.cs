using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;
using TooShortWillRead.BL.Models;

namespace TooShortWillRead.BL.Services.DataSources
{
    internal class WikipediaDataSource : IDataSource
    {
        public Task<List<DataSourceArticle>> GenerateRandomArticles()
        {
            throw new NotImplementedException();
        }

        public Task<DataSourceArticle> GetArticle(string url)
        {
            throw new NotImplementedException();
        }
    }
}
