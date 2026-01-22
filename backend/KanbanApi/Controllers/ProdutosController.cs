using Microsoft.AspNetCore.Mvc;
using KanbanApi.DTOs;
using KanbanApi.Services;

namespace KanbanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _produtoService;

    public ProdutosController(IProdutoService produtoService)
    {
        _produtoService = produtoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProdutoDto>>> GetAll()
    {
        var produtos = await _produtoService.GetAllAsync();
        return Ok(produtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProdutoDto>> GetById(long id)
    {
        var produto = await _produtoService.GetByIdAsync(id);
        if (produto == null)
            return NotFound(new { message = $"Produto com ID {id} não encontrado" });
        return Ok(produto);
    }

    [HttpPost]
    public async Task<ActionResult<ProdutoDto>> Create([FromBody] CreateProdutoDto dto)
    {
        var produto = await _produtoService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = produto.Id }, produto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProdutoDto>> Update(long id, [FromBody] UpdateProdutoDto dto)
    {
        var produto = await _produtoService.UpdateAsync(id, dto);
        if (produto == null)
            return NotFound(new { message = $"Produto com ID {id} não encontrado" });
        return Ok(produto);
    }
}
