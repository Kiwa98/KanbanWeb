using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace KanbanApi.Data;

public class KanbanDbContextFactory : IDesignTimeDbContextFactory<KanbanDbContext>
{
    public KanbanDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<KanbanDbContext>();
        
        // Connection string for design-time operations (migrations)
        var connectionString = "Server=127.0.0.1;Port=3306;Database=kanban_db;User=root;Password=;";
        
        optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

        return new KanbanDbContext(optionsBuilder.Options);
    }
}
