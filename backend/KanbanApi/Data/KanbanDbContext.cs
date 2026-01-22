using Microsoft.EntityFrameworkCore;
using KanbanApi.Entities;

namespace KanbanApi.Data;

public class KanbanDbContext : DbContext
{
    public KanbanDbContext(DbContextOptions<KanbanDbContext> options) : base(options)
    {
    }

    public DbSet<Produto> Produtos => Set<Produto>();
    public DbSet<Palete> Paletes => Set<Palete>();
    public DbSet<Movimentacao> Movimentacoes => Set<Movimentacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Produto
        modelBuilder.Entity<Produto>(entity =>
        {
            entity.ToTable("produtos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Sku).HasColumnName("sku").HasMaxLength(50).IsRequired();
            entity.Property(e => e.Nome).HasColumnName("nome").HasMaxLength(200).IsRequired();
            entity.Property(e => e.QtdPorPalete).HasColumnName("qtd_por_palete");
            entity.Property(e => e.Ativo).HasColumnName("ativo");
            entity.HasIndex(e => e.Sku).IsUnique();
        });

        // Palete
        modelBuilder.Entity<Palete>(entity =>
        {
            entity.ToTable("paletes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Uid).HasColumnName("uid").HasMaxLength(100).IsRequired();
            entity.Property(e => e.ProdutoId).HasColumnName("produto_id");
            entity.Property(e => e.DataGeracao).HasColumnName("data_geracao");
            entity.Property(e => e.Status).HasColumnName("status")
                .HasConversion<string>()
                .HasMaxLength(20);
            
            entity.HasIndex(e => e.Uid).IsUnique();
            entity.HasIndex(e => e.ProdutoId);

            entity.HasOne(e => e.Produto)
                .WithMany(p => p.Paletes)
                .HasForeignKey(e => e.ProdutoId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Movimentacao
        modelBuilder.Entity<Movimentacao>(entity =>
        {
            entity.ToTable("movimentacoes");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PaleteId).HasColumnName("palete_id");
            entity.Property(e => e.Tipo).HasColumnName("tipo")
                .HasConversion<string>()
                .HasMaxLength(20);
            entity.Property(e => e.Data).HasColumnName("data");

            entity.HasIndex(e => e.PaleteId);

            entity.HasOne(e => e.Palete)
                .WithMany(p => p.Movimentacoes)
                .HasForeignKey(e => e.PaleteId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
