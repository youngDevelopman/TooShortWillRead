using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.BL.Models;

namespace TooShortWillRead.BL.Interfaces
{
    public interface IDataSource
    {
        Task<DataSourceArticle> GetArticle(string url);

        Task<List<DataSourceArticle>> GenerateRandomArticles();
    }
}
