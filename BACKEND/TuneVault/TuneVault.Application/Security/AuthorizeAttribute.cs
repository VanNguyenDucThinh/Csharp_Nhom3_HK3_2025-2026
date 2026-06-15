using System;
using System.Diagnostics;

namespace TuneVault.Application.Security;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = true)]
public class AuthorizeAttribute:Attribute//nhãn dán
{
    public string? Roles { get; set; }//quyền truy cập

}