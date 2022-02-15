using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using TooShortWillRead.BL.Interfaces;

namespace TooShortWillRead.BL.Services
{
    public class AzureBlobPictureStorage : IPictureStorage
    {
        private readonly BlobContainerClient _blobContainerClient;
        public AzureBlobPictureStorage(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("PictureStorage");
            string containerName = configuration.GetSection("ArticlePictures:ContainerName").Value;
            var blobServiceClient = new BlobServiceClient(connectionString);
            _blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
        }

        public async Task UploadAsync(string fileName, Stream stream)
        {
            await _blobContainerClient.UploadBlobAsync(fileName, stream);
        }

        public async Task UploadAsync(Uri uri)
        {
            var filename = Path.GetFileName(uri.LocalPath);
            var blobClient = _blobContainerClient.GetBlobClient(filename);
            await blobClient.StartCopyFromUriAsync(uri);
        }

        public async Task UploadAsync(List<Uri> uris)
        {
            foreach (var uri in uris)
            {
                await this.UploadAsync(uri);
            }
        }
    }
}
