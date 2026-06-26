using System;

namespace TuneVault.Application.CreateException;

public class BadRequestException : System.Exception
{
    public BadRequestException(string message) : base(message)
    {
    }
}