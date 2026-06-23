using System.Text.Json.Serialization;
namespace TuneVault.Domain.Enums;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PlayListStatus
{
    Private=0,
    Public=1

}
