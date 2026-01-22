using Microsoft.AspNetCore.Mvc;
using KanbanApi.DTOs;
using KanbanApi.Services;

namespace KanbanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MovimentacoesController : ControllerBase
{
    private readonly IMovimentacaoService _movimentacaoService;

    public MovimentacoesController(IMovimentacaoService movimentacaoService)
    {
        _movimentacaoService = movimentacaoService;
    }

    [HttpPost("entrada")]
    public async Task<ActionResult<MovimentacaoDto>> RegistrarEntrada([FromBody] RegistrarMovimentacaoDto dto)
    {
        try
        {
            var movimentacao = await _movimentacaoService.RegistrarEntradaAsync(dto.PaleteUid);
            return Ok(movimentacao);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("saida")]
    public async Task<ActionResult<MovimentacaoDto>> RegistrarSaida([FromBody] RegistrarMovimentacaoDto dto)
    {
        try
        {
            var movimentacao = await _movimentacaoService.RegistrarSaidaAsync(dto.PaleteUid);
            return Ok(movimentacao);
        }
        catch (ArgumentException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
