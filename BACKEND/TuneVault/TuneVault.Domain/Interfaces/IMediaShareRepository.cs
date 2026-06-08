using System;
using TuneVault.Domain.Entities;

namespace TuneVault.Domain.Interfaces;

public interface IMediaShareRepository
{
    Task<bool> CreateMediaShare(MediaShare mediaShare);//Tạo mới chia sẻ bài hát
}
