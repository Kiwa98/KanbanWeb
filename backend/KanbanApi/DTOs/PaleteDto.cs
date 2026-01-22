namespace KanbanApi.DTOs;

public class PaleteDto
{
    public long Id { get; set; }
    public string Uid { get; set; } = string.Empty;
    public long ProdutoId { get; set; }
    public string ProdutoNome { get; set; } = string.Empty;
    public string ProdutoSku { get; set; } = string.Empty;
    public DateTime DataGeracao { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class GerarPaleteDto
{
    public long ProdutoId { get; set; }
    public int QtdPorPalete { get; set; }
    public int QuantidadePaletes { get; set; }
}

public class PaleteGeradoDto
{
    public string Uid { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int Qtd { get; set; }
    public string Dt { get; set; } = string.Empty;
    public string QrCodeBase64 { get; set; } = string.Empty;
    public int Numero { get; set; }
    public int Total { get; set; }
}
