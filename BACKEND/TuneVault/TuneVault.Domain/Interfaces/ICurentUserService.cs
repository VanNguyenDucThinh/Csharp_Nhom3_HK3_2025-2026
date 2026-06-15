using System;
using System.Collections.Generic;
using System.Text;

namespace TuneVault.Domain.Interfaces
{
    public interface ICurentUserService
    {
        Guid UserId { get; }
    }
}
