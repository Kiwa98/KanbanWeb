using AutoMapper;
using Microsoft.EntityFrameworkCore;
using KanbanApi.Data;
using KanbanApi.DTOs;
using KanbanApi.Entities;

namespace KanbanApi.Services;

public interface IMovimentacaoService
{
    Task<MovimentacaoDto> RegistrarEntradaAsync(string paleteUid);
    Task<MovimentacaoDto> RegistrarSaidaAsync(string paleteUid);
}

public class MovimentacaoService : IMovimentacaoService
{
    private readonly KanbanDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<MovimentacaoService> _logger;

    public MovimentacaoService(KanbanDbContext context, IMapper mapper, ILogger<MovimentacaoService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<MovimentacaoDto> RegistrarEntradaAsync(string paleteUid)
    {
        var palete = await _context.Paletes
            .Include(p => p.Produto)
            .FirstOrDefaultAsync(p => p.Uid == paleteUid);

        if (palete == null)
            throw new ArgumentException($"Palete com UID {paleteUid} não encontrado");

        palete.Status = PaleteStatus.NO_PULMAO;

        var movimentacao = new Movimentacao
        {
            PaleteId = palete.Id,
            Tipo = TipoMovimentacao.ENTRADA,
            Data = DateTime.UtcNow
        };

        _context.Movimentacoes.Add(movimentacao);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Entrada registrada: Palete {Uid}, Produto {Sku}", paleteUid, palete.Produto.Sku);

        movimentacao.Palete = palete;
        return _mapper.Map<MovimentacaoDto>(movimentacao);
    }

    public async Task<MovimentacaoDto> RegistrarSaidaAsync(string paleteUid)
    {
        var palete = await _context.Paletes
            .Include(p => p.Produto)
            .FirstOrDefaultAsync(p => p.Uid == paleteUid);

        if (palete == null)
            throw new ArgumentException($"Palete com UID {paleteUid} não encontrado");

        palete.Status = PaleteStatus.BAIXADO;

        var movimentacao = new Movimentacao
        {
            PaleteId = palete.Id,
            Tipo = TipoMovimentacao.SAIDA,
            Data = DateTime.UtcNow
        };

        _context.Movimentacoes.Add(movimentacao);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Saída registrada: Palete {Uid}, Produto {Sku}", paleteUid, palete.Produto.Sku);

        movimentacao.Palete = palete;
        return _mapper.Map<MovimentacaoDto>(movimentacao);
    }
}
