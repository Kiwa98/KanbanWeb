using Microsoft.AspNetCore.Mvc;
using KanbanApi.DTOs;
using KanbanApi.Services;

namespace KanbanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaletesController : ControllerBase
{
    private readonly IPaleteService _paleteService;

    public PaletesController(IPaleteService paleteService)
    {
        _paleteService = paleteService;
    }

    [HttpGet("{uid}")]
    public async Task<ActionResult<PaleteDto>> GetByUid(string uid)
    {
        var palete = await _paleteService.GetByUidAsync(uid);
        if (palete == null)
            return NotFound(new { message = $"Palete com UID {uid} não encontrado" });
        return Ok(palete);
    }

    [HttpPost("gerar")]
    public async Task<ActionResult<IEnumerable<PaleteGeradoDto>>> Gerar([FromBody] GerarPaleteDto dto)
    {
        try
        {
            var paletes = await _paleteService.GerarPaletesAsync(dto);
            return Ok(paletes);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
