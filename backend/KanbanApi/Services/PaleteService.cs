using System.Text;
using System.Text.Json;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using KanbanApi.Data;
using KanbanApi.DTOs;
using KanbanApi.Entities;

namespace KanbanApi.Services;

public interface IPaleteService
{
    Task<PaleteDto?> GetByUidAsync(string uid);
    Task<IEnumerable<PaleteGeradoDto>> GerarPaletesAsync(GerarPaleteDto dto);
}

public class PaleteService : IPaleteService
{
    private readonly KanbanDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<PaleteService> _logger;

    public PaleteService(KanbanDbContext context, IMapper mapper, ILogger<PaleteService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PaleteDto?> GetByUidAsync(string uid)
    {
        var palete = await _context.Paletes
            .Include(p => p.Produto)
            .FirstOrDefaultAsync(p => p.Uid == uid);
        
        return palete == null ? null : _mapper.Map<PaleteDto>(palete);
    }

    public async Task<IEnumerable<PaleteGeradoDto>> GerarPaletesAsync(GerarPaleteDto dto)
    {
        var produto = await _context.Produtos.FindAsync(dto.ProdutoId);
        if (produto == null)
            throw new ArgumentException($"Produto com ID {dto.ProdutoId} não encontrado");

        var paletesGerados = new List<PaleteGeradoDto>();
        var dataGeracao = DateTime.UtcNow;
        var dataStr = dataGeracao.ToString("yyyy-MM-dd");

        for (int i = 1; i <= dto.QuantidadePaletes; i++)
        {
            var uid = Guid.NewGuid().ToString();

            var palete = new Palete
            {
                Uid = uid,
                ProdutoId = dto.ProdutoId,
                DataGeracao = dataGeracao,
                Status = PaleteStatus.NO_PULMAO
            };

            _context.Paletes.Add(palete);

            // Criar JSON para o QR Code
            var qrData = new
            {
                uid = uid,
                sku = produto.Sku,
                nome = produto.Nome,
                qtd = dto.QtdPorPalete,
                dt = dataStr
            };

            var json = JsonSerializer.Serialize(qrData);
            var base64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(json));

            paletesGerados.Add(new PaleteGeradoDto
            {
                Uid = uid,
                Sku = produto.Sku,
                Nome = produto.Nome,
                Qtd = dto.QtdPorPalete,
                Dt = dataStr,
                QrCodeBase64 = base64,
                Numero = i,
                Total = dto.QuantidadePaletes
            });
        }

        await _context.SaveChangesAsync();
        _logger.LogInformation("Gerados {Count} paletes para produto {Sku}", dto.QuantidadePaletes, produto.Sku);

        return paletesGerados;
    }
}
