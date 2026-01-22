namespace KanbanApi.DTOs;

public class KanbanDto
{
    public string Sku { get; set; } = string.Empty;
    public string Nome { get; set; } = string.Empty;
    public int PaletesNoPulmao { get; set; }
    public int Capacidade { get; set; } = 14;
    public int TotalProdutos { get; set; }
    public string Status { get; set; } = string.Empty; // VERDE, AMARELO, VERMELHO
}
