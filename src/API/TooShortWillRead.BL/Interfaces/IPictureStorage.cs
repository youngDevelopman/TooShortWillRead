using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace TooShortWillRead.BL.Interfaces
{
    public interface IPictureStorage
    {
        Task UploadAsync(Uri uri);

        Task UploadAsync(List<Uri> uris);

        Task UploadAsync(string fileName, Stream stream);
    }
}
