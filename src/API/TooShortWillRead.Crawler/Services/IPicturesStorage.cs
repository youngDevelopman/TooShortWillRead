using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TooShortWillRead.Crawler.Services
{
    public interface IPicturesStorage
    {
        Task UploadImage(Uri uri);

        Task UploadImages(List<Uri> uris);
    }
}
