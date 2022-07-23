using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TooShortWillRead.BL.Models;

namespace TooShortWillRead.Crawler.ArticlesGenerators
{
    public interface IArticlesGenerator
    {
        Task<IEnumerable<DataSourceArticle>> GenerateArticlesAsync();
    }
}

