namespace KanbanApi.Entities;

public enum TipoMovimentacao
{
    ENTRADA,
    SAIDA
}

public class Movimentacao
{
    public long Id { get; set; }
    public long PaleteId { get; set; }
    public TipoMovimentacao Tipo { get; set; }
    public DateTime Data { get; set; }

    // Navigation
    public Palete Palete { get; set; } = null!;
}
