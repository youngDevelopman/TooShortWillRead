using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;

namespace TooShortWillRead.BL.Services.DataSources
{
    public class DataSourceFactory : IDataSourceFactory
    {
        private IServiceProvider _serviceProvider;
        public DataSourceFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IDataSource ResolveDataSource(Uri uri)
        {
            switch (uri.Host)
            {
                case "en.wikipedia.org":
                    return _serviceProvider.GetService<WikipediaDataSource>();
                case "www.britannica.com":
                    return _serviceProvider.GetService<BritannicaDataSource>();
                case "www.history.com":
                    return _serviceProvider.GetService<HistoryComDataSource>();
                default:
                    throw new Exception($"Unable to resolve data source for the {uri} uri");
            }
        }

        public IEnumerable<IDataSource> GetAllDataSources()
        {
            //yield return _serviceProvider.GetService<WikipediaDataSource>();
            yield return _serviceProvider.GetService<BritannicaDataSource>();
        }
    }
}
