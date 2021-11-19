using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace TooShortWillRead.BL.Interfaces
{
    public interface IPictureStorage
    {
        Task UploadImage(Uri uri);

        Task UploadImages(List<Uri> uris);

        Task UploadAsync(string fileName, Stream stream);
    }
}
