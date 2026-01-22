namespace KanbanApi.Entities;

public class Produto
{
    public long Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int QtdPorPalete { get; set; }
    public bool Ativo { get; set; } = true;

    // Navigation
    public ICollection<Palete> Paletes { get; set; } = new List<Palete>();
}
