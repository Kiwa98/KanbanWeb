using Microsoft.AspNetCore.Mvc;
using KanbanApi.DTOs;
using KanbanApi.Services;

namespace KanbanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KanbanController : ControllerBase
{
    private readonly IKanbanService _kanbanService;

    public KanbanController(IKanbanService kanbanService)
    {
        _kanbanService = kanbanService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<KanbanDto>>> GetKanban()
    {
        var kanban = await _kanbanService.GetKanbanAsync();
        return Ok(kanban);
    }
}
