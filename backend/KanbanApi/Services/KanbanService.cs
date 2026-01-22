using Microsoft.EntityFrameworkCore;
using KanbanApi.Data;
using KanbanApi.DTOs;
using KanbanApi.Entities;

namespace KanbanApi.Services;

public interface IKanbanService
{
    Task<IEnumerable<KanbanDto>> GetKanbanAsync();
}

public class KanbanService : IKanbanService
{
    private readonly KanbanDbContext _context;
    private const int CAPACIDADE_MAXIMA = 14;

    public KanbanService(KanbanDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<KanbanDto>> GetKanbanAsync()
    {
        // Buscar todos os produtos ativos
        var produtos = await _context.Produtos
            .Where(p => p.Ativo)
            .OrderBy(p => p.Nome)
            .ToListAsync();

        // Buscar contagem de paletes NO_PULMAO por produto
        var paletesNoPulmao = await _context.Paletes
            .Where(p => p.Status == PaleteStatus.NO_PULMAO)
            .GroupBy(p => p.ProdutoId)
            .Select(g => new { ProdutoId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.ProdutoId, x => x.Count);

        var kanbanList = new List<KanbanDto>();

        foreach (var produto in produtos)
        {
            var qtdPaletes = paletesNoPulmao.GetValueOrDefault(produto.Id, 0);
            var status = CalcularStatus(qtdPaletes);
            var totalProdutos = qtdPaletes * produto.QtdPorPalete;

            kanbanList.Add(new KanbanDto
            {
                Sku = produto.Sku,
                Nome = produto.Nome,
                PaletesNoPulmao = qtdPaletes,
                Capacidade = CAPACIDADE_MAXIMA,
                TotalProdutos = totalProdutos,
                Status = status
            });
        }

        return kanbanList;
    }

    private static string CalcularStatus(int qtdPaletes)
    {
        // 0-3 → VERMELHO
        // 4-8 → AMARELO
        // 9-14 → VERDE
        return qtdPaletes switch
        {
            <= 3 => "VERMELHO",
            <= 8 => "AMARELO",
            _ => "VERDE"
        };
    }
}
