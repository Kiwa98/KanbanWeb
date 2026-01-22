namespace KanbanApi.Entities;

public enum PaleteStatus
{
    NO_PULMAO,
    BAIXADO
}

public class Palete
{
    public long Id { get; set; }
    public string Uid { get; set; } = string.Empty;
    public long ProdutoId { get; set; }
    public DateTime DataGeracao { get; set; }
    public PaleteStatus Status { get; set; }

    // Navigation
    public Produto Produto { get; set; } = null!;
    public ICollection<Movimentacao> Movimentacoes { get; set; } = new List<Movimentacao>();
}
