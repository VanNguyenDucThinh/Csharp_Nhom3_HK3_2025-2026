using System;
using MediatR;
using TuneVault.Application.DTOs;

namespace TuneVault.Application.UseCases.HistoryMedia.Command;

public class GetHistoryQuery:IRequest<List<HistoryMediaDto>>
{

}
