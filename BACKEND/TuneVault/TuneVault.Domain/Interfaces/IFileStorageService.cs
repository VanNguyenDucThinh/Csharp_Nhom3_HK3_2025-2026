using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(Stream filestream, string FileName,string FolderName ,string contentType); //lưu file
        Task<bool> DeleteFileAsync(string filePath);// xóa file
    }
}
