using System;

namespace TuneVault.Application.CreateException;

public class NotFoundException : System.Exception
{
    public NotFoundException(string message) : base(message)
    {
    }
}