using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.BL.Enums;
using TooShortWillRead.BL.Models;

namespace TooShortWillRead.BL.Interfaces
{
    public interface IDataSource
    {
        DataSourceEnum DataSource { get; }

        Task<DataSourceArticle> GetArticleAsync(string url);

        Task<List<DataSourceArticle>> GenerateRandomArticlesAsync();
    }
}
