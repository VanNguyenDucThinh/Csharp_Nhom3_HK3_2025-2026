using Microsoft.AspNetCore.Hosting;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System;
using System.Collections.Generic;
using System.Text;
using TuneVault.Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace TuneVault.Infrastructure.FileStorage
{
    public class FileStorageService : IFileStorageService
    {
        private readonly string _wwwrootPath;
        public FileStorageService(IWebHostEnvironment webHost)
        {
            _wwwrootPath = webHost.WebRootPath;


            //Đề phòng thư mục wwwroot chưa được tạo khi chạy app
            if (string.IsNullOrEmpty(_wwwrootPath))
            {
                _wwwrootPath = Path.Combine(AppContext.BaseDirectory, "wwwroot");
            }

            if (!Directory.Exists(_wwwrootPath))
            {
                Directory.CreateDirectory(_wwwrootPath);
            }

        }

        public Task<bool> DeleteFileAsync(string filePath)
        {
            var FullPath = Path.Combine(_wwwrootPath, filePath);
            if (File.Exists(FullPath))
            {
                File.Delete(FullPath);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        public async Task<string> UploadFileAsync(Stream filestream, string FileName, string FolderName ,string contentType)
        {
            if(filestream == null || filestream.Length == 0)
                throw new ArgumentNullException("Filestream không được rỗng");
            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(FileName)}"; //tránh trùng file

            //thư mục đích bên trong wwwroot
            var TargetFolder = Path.Combine(_wwwrootPath, FolderName); 
            if(!Directory.Exists(TargetFolder)) Directory.CreateDirectory(TargetFolder);

            var FullPath = Path.Combine(TargetFolder, uniqueFileName); //đường dẫn đầy đủ để lưu file xuống ổ


            //ghi file xuống ổ cứng
            using(var LocalFileStream = new FileStream(FullPath , FileMode.Create , FileAccess.Write, FileShare.None,4096, useAsync: true))
            {
                await filestream.CopyToAsync(LocalFileStream);
            }

            return Path.Combine(FolderName, uniqueFileName).Replace('\\', '/'); //thay thế dấu \\ của window thành / của URL web
        }
        // private readonly Cloudinary _cloudinary;
        // public FileStorageService(IConfiguration configuration)
        // {
            
        // }
    }



}
