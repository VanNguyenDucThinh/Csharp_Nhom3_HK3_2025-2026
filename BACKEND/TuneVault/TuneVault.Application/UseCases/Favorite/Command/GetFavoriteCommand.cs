using System;
using System;
using MediatR;
using TuneVault.Application.DTOs;
using TuneVault.Application.UseCases.Follow.Command;
using TuneVault.Domain.Interfaces;
using TuneVault.Domain.Entities;
using TuneVault.Domain.Events;

namespace TuneVault.Application.UseCases.Favorite.Command;

public class GetFavoriteCommand:IRequest<List<MediaDto>>
{


}
