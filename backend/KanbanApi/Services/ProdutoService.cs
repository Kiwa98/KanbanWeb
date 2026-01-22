using AutoMapper;
using Microsoft.EntityFrameworkCore;
using KanbanApi.Data;
using KanbanApi.DTOs;
using KanbanApi.Entities;

namespace KanbanApi.Services;

public interface IProdutoService
{
    Task<IEnumerable<ProdutoDto>> GetAllAsync();
    Task<ProdutoDto?> GetByIdAsync(long id);
    Task<ProdutoDto> CreateAsync(CreateProdutoDto dto);
    Task<ProdutoDto?> UpdateAsync(long id, UpdateProdutoDto dto);
}

public class ProdutoService : IProdutoService
{
    private readonly KanbanDbContext _context;
    private readonly IMapper _mapper;

    public ProdutoService(KanbanDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProdutoDto>> GetAllAsync()
    {
        var produtos = await _context.Produtos
            .Where(p => p.Ativo)
            .OrderBy(p => p.Nome)
            .ToListAsync();
        return _mapper.Map<IEnumerable<ProdutoDto>>(produtos);
    }

    public async Task<ProdutoDto?> GetByIdAsync(long id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        return produto == null ? null : _mapper.Map<ProdutoDto>(produto);
    }

    public async Task<ProdutoDto> CreateAsync(CreateProdutoDto dto)
    {
        var produto = _mapper.Map<Produto>(dto);
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return _mapper.Map<ProdutoDto>(produto);
    }

    public async Task<ProdutoDto?> UpdateAsync(long id, UpdateProdutoDto dto)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto == null) return null;

        produto.Sku = dto.Sku;
        produto.Nome = dto.Nome;
        produto.QtdPorPalete = dto.QtdPorPalete;
        produto.Ativo = dto.Ativo;

        await _context.SaveChangesAsync();
        return _mapper.Map<ProdutoDto>(produto);
    }
}
