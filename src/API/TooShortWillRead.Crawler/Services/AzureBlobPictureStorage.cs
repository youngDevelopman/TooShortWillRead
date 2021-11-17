using Azure.Storage.Blobs;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Collections.Generic;

namespace TooShortWillRead.Crawler.Services
{
    public class AzureBlobPictureStorage : IPicturesStorage
    {
        private readonly BlobContainerClient _blobContainerClient;
        public AzureBlobPictureStorage(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("PictureStorage");
            string containerName = configuration.GetSection("ArticlePicturesContainerName").Value;
            var blobServiceClient = new BlobServiceClient(connectionString);
            _blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
        }

        public async Task UploadImage(Uri uri)
        {
            var filename = Path.GetFileName(uri.LocalPath);
            var blobClient = _blobContainerClient.GetBlobClient(filename);
            await blobClient.StartCopyFromUriAsync(uri);
        }

        public async Task UploadImages(List<Uri> uris)
        {
            foreach (var uri in uris) 
            {
                await this.UploadImage(uri);
            }
        }
    }
}
