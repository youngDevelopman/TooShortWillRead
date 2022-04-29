using Microsoft.EntityFrameworkCore;
using TooShortWillRead.DAL.EntityConfiguration;
using TooShortWillRead.DAL.Models;

namespace TooShortWillRead.DAL
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Article> Articles { get; set; }

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ArticleEntityConfiguration());
            modelBuilder.ApplyConfiguration(new CategoryEntityConfiguration());
            modelBuilder.ApplyConfiguration(new DataSourceEntityConfiguration());
        }
    }
}
