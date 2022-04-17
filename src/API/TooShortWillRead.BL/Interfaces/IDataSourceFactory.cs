using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TooShortWillRead.BL.Interfaces
{
    public interface IDataSourceFactory
    {
        IEnumerable<IDataSource> GetAllDataSources();
        IDataSource ResolveDataSource(Uri uri);
    }
}
