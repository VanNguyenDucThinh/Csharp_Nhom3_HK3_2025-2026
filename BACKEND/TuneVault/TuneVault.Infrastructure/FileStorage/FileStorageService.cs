using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;
using TuneVault.Domain.Interfaces;

namespace TuneVault.Infrastructure.FileStorage
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _baseProjectPath;

        public FileStorageService(IWebHostEnvironment webHost)
        {
            // ĐỔI Ở ĐÂY: Lấy trực tiếp thư mục gốc của dự án (TuneVault.API)
            _baseProjectPath = webHost.ContentRootPath; 
        }

        public Task<bool> DeleteFileAsync(string filePath)
        {
            var FullPath = Path.Combine(_baseProjectPath, filePath);
            if (File.Exists(FullPath))
            {
                File.Delete(FullPath);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public async Task<string> UploadFileAsync(Stream filestream, string FileName, string FolderName, string contentType)
        {
            if (filestream == null || filestream.Length == 0)
                throw new ArgumentNullException("Filestream không được rỗng");

            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(FileName)}";

            // Thư mục đích sẽ nằm ngay ngoài gốc dự án (Ví dụ: TuneVault.API/media_files)
            var TargetFolder = Path.Combine(_baseProjectPath, FolderName); 
            if (!Directory.Exists(TargetFolder)) Directory.CreateDirectory(TargetFolder);

            var FullPath = Path.Combine(TargetFolder, uniqueFileName);

            using (var LocalFileStream = new FileStream(FullPath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, useAsync: true))
            {
                await filestream.CopyToAsync(LocalFileStream);
            }

            // Trả về chuỗi dạng: media_files/tên_file.mp3
            return Path.Combine(FolderName, uniqueFileName).Replace('\\', '/');
        }
    }
}