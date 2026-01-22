namespace KanbanApi.DTOs;

public class ProdutoDto
{
    public long Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int QtdPorPalete { get; set; }
    public bool Ativo { get; set; }
}

public class CreateProdutoDto
{
    public string Sku { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int QtdPorPalete { get; set; }
    public bool Ativo { get; set; } = true;
}

public class UpdateProdutoDto
{
    public string Sku { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int QtdPorPalete { get; set; }
    public bool Ativo { get; set; }
}
