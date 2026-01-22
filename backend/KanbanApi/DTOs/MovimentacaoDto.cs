namespace KanbanApi.DTOs;

public class MovimentacaoDto
{
    public long Id { get; set; }
    public long PaleteId { get; set; }
    public string PaleteUid { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public DateTime Data { get; set; }
}

public class RegistrarMovimentacaoDto
{
    public string PaleteUid { get; set; } = string.Empty;
}
